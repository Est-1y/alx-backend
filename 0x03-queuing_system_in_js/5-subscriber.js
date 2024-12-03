#!/usr/bin/yarn dev
import { createClient } from 'redis';

// const
const client = createClient();
const EXIT_MSG = 'KILL_SERVER';

// show error
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// connect client to server
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// subsribing to holberton school channel
client.subscribe('holberton school channel');

// handle message
client.on('message', (_err, msg) => {
  console.log(msg);
  if (msg === EXIT_MSG) {
    client.unsubscribe();
    client.quit();
  }
});
