interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  dialect: 'mssql';
  timezone: string;
  host: string;
  serverPort: string;
  logging: typeof console.log | boolean;
  autoBackup: boolean;
  sessionSecret: string;
  jwtSecretKey: string;
  jwtTokenExpireTime: string;
  refreshTokenExpiryTime: string;
  demoUserToken: string;
}

export { DatabaseConfig };
