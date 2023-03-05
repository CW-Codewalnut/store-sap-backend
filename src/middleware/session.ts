import { Application } from 'express';
import session, { SessionOptions, CookieOptions } from 'express-session';
import ConnectSession from 'connect-session-sequelize';
import configEnv from '../config/config';
import { Config } from '../interfaces/config/Config.interface';

import { sequelize } from '../models';

const SequelizeStore = ConnectSession(session.Store);
const config = configEnv[process.env.NODE_ENV as keyof Config];

function extendDefaultFields(defaults: any, _session: any) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: _session.userId,
  };
}

const sessionMiddleware = (app: Application) => {
  const sequelizeStore = new SequelizeStore({
    db: sequelize,
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
