import { Application } from 'express';
import session, { SessionOptions, CookieOptions } from 'express-session';
import ConnectSession from 'connect-session-sequelize';

import { sequelize } from '../models';
import {
  DefaultFields,
  ExtendReturnData,
} from '../interfaces/session/session.interface';

const configs = require('../config/config');

const env = process.env.NODE_ENV || 'local';
const config = configs[env];

require('../models/session');

const SequelizeStore = ConnectSession(session.Store);

function extendDefaultFields(
  defaults: DefaultFields,
  session: any,
): ExtendReturnData {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
  };
}

const sessionMiddleware = (app: Application) => {
  const sequelizeStore = new SequelizeStore({
    db: sequelize,
    table: 'Session',
    extendDefaultFields,
  });

  const cookieOptions: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  };

  const sessionConfig: SessionOptions = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: sequelizeStore,
    cookie: cookieOptions,
  };

  app.use(session(sessionConfig));
};

export default sessionMiddleware;
