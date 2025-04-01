require('dotenv').config();
import Logger from 'bunyan';
import { name, version } from '../../package.json';
import { ENV_TYPE, getLogger, getLogLevel } from './helpers';

abstract class Config {
  public name: string = name;
  public version: string = version;
  public isProduction: boolean;
  public mongoConnectionString: string;
  public log: Logger;
  public tronNode: {
    isTestNet: boolean;
    key: string;
  };
  public ethNode: {
    isTestNet: boolean;
    key: string;
  };
};

class DevelopmentConfig extends Config {
  public constructor() {
    super();
    this.isProduction = false;
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.DEVELOPMENT));
    this.mongoConnectionString = "mongodb://127.0.0.1:27017/crypto";
    this.tronNode = {
      isTestNet: true,
      key: 'dd412e64-e48f-4ab3-8cce-1226e8c9a0f4'
    }
    this.ethNode = {
      isTestNet: true,
      key: '0262f79ea79e4c54b6a54fce4e363043'
    }
  };
};

class ProductionConfig extends Config {
  public constructor() {
    super();
    this.isProduction = true;
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.PRODUCTION));
    this.mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
    this.tronNode = {
      isTestNet: false,
      key: 'dd412e64-e48f-4ab3-8cce-1226e8c9a0f4'
    }
    this.ethNode = {
      isTestNet: false,
      key: '0262f79ea79e4c54b6a54fce4e363043'
    }
  };
};

const config = process.env.NODE_ENV === "production" ? new ProductionConfig() : new DevelopmentConfig();
export default config;