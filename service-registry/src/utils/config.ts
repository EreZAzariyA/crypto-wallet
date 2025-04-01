require('dotenv').config();
import bunyan, { LogLevel } from "bunyan";
import pjs from '../../package.json';
import Logger from "bunyan";

export enum ENV_TYPE {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
};

const { name, version } = pjs;

const getLogger = (name: string, version: string, level: LogLevel) => (
  bunyan.createLogger({ name: `${name}:${version}`, level })
);

const getLogLevel = (envType: ENV_TYPE.DEVELOPMENT | ENV_TYPE.PRODUCTION) => {
  const logLevel = envType === ENV_TYPE.DEVELOPMENT ? 'debug' : 'info';
  return logLevel;
};

export abstract class Config {
  public port: number;
  public serviceTimeout = 30000;
  public log: Logger;
};

class DevelopmentConfig extends Config {
  public constructor() {
    super();
    this.port = 5001;
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.DEVELOPMENT))
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super();
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.PRODUCTION));
    this.port = +process.env.PORT;
  };
};

const config = process.env.NODE_ENV !== "production" ? new DevelopmentConfig() : new ProductionConfig();
export default config;
