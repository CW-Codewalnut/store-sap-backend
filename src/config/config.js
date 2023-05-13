require('dotenv').config();

module.exports = {
  local: {
    database: process.env.LOCAL_DB,
    username: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASS,
    dialect: 'mssql',
    host: process.env.LOCAL_HOST,
    serverPort: process.env.LOCAL_PORT,
    logging: console.log,
    autoBackup: false,
    sessionSecret: process.env.SESSION_SECRET_KEY,
    jwtSecret: process.env.JWT_SECRET_KEY,
    mailHost: process.env.LOCAL_MAIL_HOST,
    mailUser: process.env.LOCAL_MAIL_USER,
    mailPass: process.env.LOCAL_MAIL_PASS,
    mailFrom: process.env.LOCAL_MAIL_FROM,
    appBaseUrl: process.env.LOCAL_APP_BASE_URL,
    sonarToken: process.env.SONAR_TOKEN,
    sonarHostUrl: process.env.SONAR_HOST_URL,
  },
  dev: {
    database: process.env.DEV_DB,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASS,
    dialect: 'mssql',
    host: process.env.DEV_HOST,
    serverPort: process.env.DEV_PORT,
    logging: console.log,
    autoBackup: false,
    sessionSecret: process.env.SESSION_SECRET_KEY,
    jwtSecret: process.env.JWT_SECRET_KEY,
    mailHost: process.env.DEV_MAIL_HOST,
    mailUser: process.env.DEV_MAIL_USER,
    mailPass: process.env.DEV_MAIL_PASS,
    mailFrom: process.env.DEV_MAIL_FROM,
    appBaseUrl: process.env.DEV_APP_BASE_URL,
    sonarToken: process.env.SONAR_TOKEN,
    sonarHostUrl: process.env.SONAR_HOST_URL,
  },
  uat: {
    database: process.env.UAT_DB,
    username: process.env.UAT_DB_USER,
    password: process.env.UAT_DB_PASS,
    dialect: 'mssql',
    host: process.env.UAT_HOST,
    serverPort: process.env.UAT_PORT,
    logging: false,
    autoBackup: true,
    sessionSecret: process.env.SESSION_SECRET_KEY,
    jwtSecret: process.env.JWT_SECRET_KEY,
    mailHost: process.env.UAT_MAIL_HOST,
    mailUser: process.env.UAT_MAIL_USER,
    mailPass: process.env.UAT_MAIL_PASS,
    appBaseUrl: process.env.UAT_APP_BASE_URL,
    sonarToken: process.env.SONAR_TOKEN,
    sonarHostUrl: process.env.SONAR_HOST_URL,
  },
  prod: {
    database: process.env.PROD_DB,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASS,
    dialect: 'mssql',
    host: process.env.PROD_HOST,
    serverPort: process.env.PROD_PORT,
    logging: false,
    autoBackup: true,
    sessionSecret: process.env.SESSION_SECRET_KEY,
    jwtSecret: process.env.JWT_SECRET_KEY,
    mailHost: process.env.PROD_MAIL_HOST,
    mailUser: process.env.PROD_MAIL_USER,
    mailPass: process.env.PROD_MAIL_PASS,
    appBaseUrl: process.env.PROD_APP_BASE_URL,
    sonarToken: process.env.SONAR_TOKEN,
    sonarHostUrl: process.env.SONAR_HOST_URL,
  },
};
