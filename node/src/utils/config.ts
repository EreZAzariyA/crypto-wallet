require('dotenv').config();
import { name, version } from '../../package.json';
import Logger from 'bunyan';
import { ENV_TYPE, getLogger, getLogLevel } from './helpers';

abstract class Config {
  public port: number = +process.env.PORT;
  public isProduction: boolean;
  public secretKey: string;
  public loginExpiresIn: number;
  public mongoConnectionString: string;
  public log: Logger;

  public tronNode: {
    isTestNet: boolean;
    key: string;
  }
  public ethNode: {
    isTestNet: boolean;
    key: string;
  }
};

class DevelopmentConfig extends Config {
  public constructor() {
    super();
    this.isProduction = false;
    // this.loginExpiresIn = 3 * 60 * 60 * 1000;
    this.loginExpiresIn = 15 * 60 * 1000;
    this.mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
    this.secretKey = 'secret';
    this.mongoConnectionString = "mongodb://127.0.0.1:27017/crypto";
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.DEVELOPMENT));
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
    this.loginExpiresIn = 30 * 60 * 1000;
    this.secretKey = process.env.SECRET_KEY;
    this.log = getLogger(name, version, getLogLevel(ENV_TYPE.PRODUCTION));
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