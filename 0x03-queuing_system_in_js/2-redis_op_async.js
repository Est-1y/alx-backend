#!/usr/bin/yarn dev
import { promisify } from 'util';
import { createClient, print } from 'redis';

// client
const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// set school
const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print);
};

// display value
const displaySchoolValue = async (schoolName) => {
  console.log(await promisify(client.GET).bind(client)(schoolName));
};

async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});
