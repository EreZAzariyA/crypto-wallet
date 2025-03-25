import bunyan, { LogLevel } from 'bunyan';

export enum ENV_TYPE {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
};

export const getLogger = (name: string, version: string, level: LogLevel) => {
  return bunyan.createLogger({
    name: `${name}:${version}`,
    level,
    streams: [
      {
        stream: process.stdout,
        level
      }
    ]
  });
};

export const getLogLevel = (envType: ENV_TYPE): LogLevel => {
  return envType === ENV_TYPE.DEVELOPMENT ? "debug" : "info";
};