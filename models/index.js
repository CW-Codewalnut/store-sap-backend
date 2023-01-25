'use strict';
const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/config')[process.env.NODE_ENV];
const db = {};

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
      typeCast: true
    },
    logging: config.logging,
  },
);


/* Check database connection */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
