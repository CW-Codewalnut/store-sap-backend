import { Application } from 'express';
import session, { SessionOptions, CookieOptions } from 'express-session';
import ConnectSession from 'connect-session-sequelize';
import configEnv from '../config/config';
import Config from '../interfaces/config/Config.type';

import { sequelize } from '../models';
import {
  DefaultFields,
  ExtendReturnData,
} from '../interfaces/session/session.interface';

require('../models/session');

const SequelizeStore = ConnectSession(session.Store);
const config = configEnv[process.env.NODE_ENV as keyof Config];

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
    sameSite: 'none',
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
