const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require('../config/config')[process.env.NODE_ENV];
const { sequelize } = require('../models');

function extendDefaultFields(defaults, _session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: _session.userId,
  };
}

module.exports = (app) => {
  const sequelizeStore = new SequelizeStore({
    db: sequelize,
    table: 'Session',
    extendDefaultFields,
  });

  const sessionConfig = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: sequelizeStore,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24,
      SameSite: 'none',
      httpOnly: true,
    },
  };

  app.use(session(sessionConfig));
};
