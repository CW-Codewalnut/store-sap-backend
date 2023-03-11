import { DatabaseConfig } from './DatabaseConfig.interface';

type Config = {
  local: DatabaseConfig;
  dev: DatabaseConfig;
  uat: DatabaseConfig;
  prod: DatabaseConfig;
};

export default Config;
