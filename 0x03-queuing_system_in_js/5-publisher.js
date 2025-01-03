#!/usr/bin/yarn dev
import { createClient } from 'redis';

// const
const client = createClient();

// error
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// publish message
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
};

// connect to server
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// messages
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
