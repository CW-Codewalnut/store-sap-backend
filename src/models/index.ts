import { Sequelize } from 'sequelize';
import configEnv from '../config/config';
import Config from '../interfaces/config/Config.type';

const config = configEnv[process.env.NODE_ENV as keyof Config];

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
