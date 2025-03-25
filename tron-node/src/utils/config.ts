require('dotenv').config();
import { name, version } from '../../package.json';
import Logger from 'bunyan';
import { ENV_TYPE, getLogger, getLogLevel } from './helpers';

abstract class Config {
  public port: number = +process.env.PORT;
  public isProduction: boolean;
  public log: Logger;
  public tronNode: {
    isTestNet: boolean;
    key: string;
  }
};

class DevelopmentConfig extends Config {
  public constructor() {
    super();
    this.isProduction = false;
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.DEVELOPMENT));
    this.tronNode = {
      isTestNet: true,
      key: 'dd412e64-e48f-4ab3-8cce-1226e8c9a0f4'
    }
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super();
    this.isProduction = true;
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.PRODUCTION));
    this.tronNode = {
      isTestNet: false,
      key: 'dd412e64-e48f-4ab3-8cce-1226e8c9a0f4'
    }
  };
};

const config = process.env.NODE_ENV === "production" ? new ProductionConfig() : new DevelopmentConfig();
export default config;