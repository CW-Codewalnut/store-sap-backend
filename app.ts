import express, { Application } from 'express';
import helmet from 'helmet';
import http from 'http';
import cors, { CorsOptions } from 'cors';
import debug from 'debug';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';

import session, { SessionOptions, CookieOptions } from 'express-session';
import ConnectSession from 'connect-session-sequelize';
import configEnv from './config/config';
import { Config } from './interfaces/config/Config.interface';
import { sequelize } from './models';
import sessionFn from './middleware/session';
import passportFn from './middleware/passport';
import routesFn from './routes';

const SequelizeStore = ConnectSession(session.Store);

dotenv.config();

const app: Application = express();
const env = process.env.NODE_ENV;

const config = configEnv[env as keyof Config];

// Globals
global.baseDir = __dirname;

/**
 * Helmet helps to secure express to setting a various header.
 */
app.use(helmet());

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'https://sap-dev-api.codewalnut.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

sessionFn(app);

/**
 *  Passport works on top of the express-session.
 *  So this two line will come after express-session
 */
app.use(passport.initialize());
app.use(passport.session());

passportFn();

const publicDir = path.join(__dirname, '/public');
app.use(express.static(publicDir));

routesFn(app);

const port = parseInt(config.serverPort, 10);
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Environment running on:  ${process.env.NODE_ENV}`);
  console.log(`Server is running on port: ${port}`);
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
  debug(`Listening on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);

module.exports = app;
