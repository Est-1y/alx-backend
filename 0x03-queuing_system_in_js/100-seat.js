#!/usr/bin/yarn dev
import express from 'express';
import { promisify } from 'util';
import { createQueue } from 'kue';
import { createClient } from 'redis';

// consts
const app = express();
const client = createClient({ name: 'reserve_seat' });
const queue = createQueue();
const INITIAL_SEATS_COUNT = 50;
let reservationEnabled = false;
const PORT = 1245;

// reserveSeat
const reserveSeat = async (number) => {
  return promisify(client.SET).bind(client)('available_seats', number);
};

// getCurrentAvailableSeats
const getCurrentAvailableSeats = async () => {
  return promisify(client.GET).bind(client)('available_seats');
};

// app.get('/available_seats', (_, res)
app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats()
    // .then(result => Number.parseInt(result || 0))
    .then((numberOfAvailableSeats) => {
      res.json({ numberOfAvailableSeats })
    });
});

// app.get('/reserve_seat', (_req, res)
app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  try {
    const job = queue.create('reserve_seat');

    job.on('failed', (err) => {
      console.log(
        'Seat reservation job',
        job.id,
        'failed:',
        err.message || err.toString(),
      );
    });
    job.on('complete', () => {
      console.log(
        'Seat reservation job',
        job.id,
        'completed'
      );
    });
    job.save();
    res.json({ status: 'Reservation in process' });
  } catch {
    res.json({ status: 'Reservation failed' });
  }
});

// app.get('/process', (_req, res)
app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', (_job, done) => {
    getCurrentAvailableSeats()
      .then((result) => Number.parseInt(result || 0))
      .then((availableSeats) => {
        reservationEnabled = availableSeats <= 1 ? false : reservationEnabled;
        if (availableSeats >= 1) {
          reserveSeat(availableSeats - 1)
            .then(() => done());
        } else {
          done(new Error('Not enough seats available'));
        }
      });
  });
});

// resetAvailableSeats
const resetAvailableSeats = async (initialSeatsCount) => {
  return promisify(client.SET)
    .bind(client)('available_seats', Number.parseInt(initialSeatsCount));
};

// listening to server
app.listen(PORT, () => {
  resetAvailableSeats(process.env.INITIAL_SEATS_COUNT || INITIAL_SEATS_COUNT)
    .then(() => {
      reservationEnabled = true;
      console.log(`API available on localhost port ${PORT}`);
    });
});

// export
export default app;
