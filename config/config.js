require('dotenv').config();

module.exports = {
  local: {
    database: process.env.LOCAL_DB,
    username: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASS,
    dialect: 'mssql',
    timezone: '+05:30',
    host: process.env.LOCAL_HOST,
    serverPort: process.env.LOCAL_PORT,
    logging: console.log,
    autoBackup: false,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtTokenExpireTime: process.env.JWT_TOKEN_EXPIRE_TIME,
    refreshTokenExpiryTime: process.env.REFRESH_TOKEN_EXPIRY_TIME,
    demoUserToken: process.env.DEMO_USER_TOKEN,
  },
  dev: {
    database: process.env.DEV_DB,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASS,
    dialect: 'mssql',
    timezone: '+05:30',
    host: process.env.DEV_HOST,
    serverPort: process.env.DEV_PORT,
    logging: console.log,
    autoBackup: false,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtTokenExpireTime: process.env.JWT_TOKEN_EXPIRE_TIME,
    refreshTokenExpiryTime: process.env.REFRESH_TOKEN_EXPIRY_TIME,
    demoUserToken: process.env.DEMO_USER_TOKEN,
  },
  uat: {
    database: process.env.UAT_DB,
    username: process.env.UAT_DB_USER,
    password: process.env.UAT_DB_PASS,
    dialect: 'mssql',
    timezone: '+05:30',
    host: process.env.UAT_HOST,
    serverPort: process.env.UAT_PORT,
    logging: false,
    autoBackup: true,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtTokenExpireTime: process.env.JWT_TOKEN_EXPIRE_TIME,
    refreshTokenExpiryTime: process.env.REFRESH_TOKEN_EXPIRY_TIME,
    demoUserToken: process.env.DEMO_USER_TOKEN,
  },
  prod: {
    database: process.env.PROD_DB,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASS,
    dialect: 'mssql',
    timezone: '+05:30',
    host: process.env.PROD_HOST,
    serverPort: process.env.PROD_PORT,
    logging: false,
    autoBackup: true,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtTokenExpireTime: process.env.JWT_TOKEN_EXPIRE_TIME,
    refreshTokenExpiryTime: process.env.REFRESH_TOKEN_EXPIRY_TIME,
    demoUserToken: process.env.DEMO_USER_TOKEN,
  },
};
