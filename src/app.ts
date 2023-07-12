import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import sessionMiddleware from './middleware/session';
import passportMiddleware from './middleware/passport';
import routesMiddleware from './routes';
import ErrorHandler from './middleware/error-handler';
import './models/association';

const configs = require('./config/config');

const env = process.env.NODE_ENV || 'local';
const config = configs[env];

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'https://sap-dev.codewalnut.com',
    'https://sap-uat.codewalnut.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

sessionMiddleware(app);

/**
 *  Passport works on top of the express-session.
 *  So this two line will come after express-session
 */
app.use(passport.initialize());
app.use(passport.session());

passportMiddleware();

const publicDir = path.join(__dirname, '/public');
app.use(express.static(publicDir));

routesMiddleware(app);

app.use(ErrorHandler);

const port = parseInt(config.serverPort, 10);
app.set('port', port);

const server = app.listen(port, () => {
  console.info(`Environment running on:  ${process.env.NODE_ENV}`);
  console.info(`Server is running on port: ${port}`);
});

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: any) => {
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
};

/**
 * Event listener for HTTP server "error" event.
 */
server.on('error', onError);

export default app;
export { server };
