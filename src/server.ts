import {ValeriabackendApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import * as express from 'express';
import {Request, Response} from 'express';
import * as path from 'path';
import pEvent from 'p-event';

export class ExpressServer {
  private app: express.Application;
  private lbApp: ValeriabackendApplication;

  constructor(options: ApplicationConfig = {}) {
    const session = require('express-session');
    const Keycloak = require('keycloak-connect');
    const cors = require('cors');

    this.app = express();
    this.lbApp = new ValeriabackendApplication(options);

    const memoryStore = new session.MemoryStore();

    this.app.use(
      session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
      }),
    );

    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', 'localhost:*'); //allowed websites CORS
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });

    const keycloak = new Keycloak({store: memoryStore});

    this.app.options('*', cors());

    this.app.use(
      keycloak.middleware({
        logout: '/logout',
        admin: '/',
        protected: '/api',
      }),
    );

    // Add base path for keycloak and lb4
    this.app.use('/api', keycloak.protect(), this.lbApp.requestHandler);

    // Custom Express routes
    this.app.get('/', function(_req: Request, res: Response) {
      res.sendFile(path.resolve('public/express.html'));
    });
    this.app.get('/hello', function(_req: Request, res: Response) {
      res.send('Hello world!');
    });
  }

  // lb4 app boot
  async boot() {
    await this.lbApp.boot();
  }

  // express app boot
  async start() {
    const port = 8080;
    const server = this.app.listen(port);
    await pEvent(server, 'listening');
  }
}
