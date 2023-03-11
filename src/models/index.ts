import { Sequelize } from 'sequelize';

const configs = require('../config/config');

const env = process.env.NODE_ENV || 'local';
const config = configs[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    database: config.database,
    username: config.username,
    password: config.password,
    dialect: config.dialect,
    timezone: config.timezone,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    logging: config.logging,
  },
);

/* Check database connection */
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export { Sequelize, sequelize };
