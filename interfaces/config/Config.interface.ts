import { DatabaseConfig } from "./DatabaseConfig.interface";
interface Config {
  local: DatabaseConfig;
  dev: DatabaseConfig;
  uat: DatabaseConfig;
  prod: DatabaseConfig;
}

export { Config };
