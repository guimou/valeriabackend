import {ExpressServer} from './server';
import {ValeriabackendApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ExpressServer, ValeriabackendApplication};

export async function main(options: ApplicationConfig = {}) {
  const server = new ExpressServer(options);
  await server.boot();
  await server.start();
  console.log('Server is running');
}
