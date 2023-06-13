import { Application } from 'express';
import ExpressSession, { SessionOptions, CookieOptions } from 'express-session';
import ConnectSession from 'connect-session-sequelize';

import { sequelize } from '../models';
import {
  DefaultFields,
  ExtendReturnData,
} from '../interfaces/session/session.interface';
import SessionModel from '../interfaces/masters/session.interface';

const configs = require('../config/config');

const env = process.env.NODE_ENV || 'local';
const config = configs[env];

require('../models/session');

const SequelizeStore = ConnectSession(ExpressSession.Store);

function extendDefaultFields(
  defaults: DefaultFields,
  session: SessionModel,
): ExtendReturnData {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
    activePlantId: session.activePlantId,
  };
}

const sessionMiddleware = (app: Application) => {
  const sequelizeStore = new SequelizeStore({
    db: sequelize,
    table: 'Session',
    extendDefaultFields,
  });

  sequelizeStore.sync();

  const cookieOptions: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  };

  const sessionConfig: SessionOptions = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sequelizeStore,
    cookie: cookieOptions,
  };

  app.use(ExpressSession(sessionConfig));
};

export default sessionMiddleware;
