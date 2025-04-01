import semver from "semver";
import Logger from "bunyan";
import config from "../utils/config";

export interface Service {
  name: string;
  version: string;
  port: string;
  ip: string;
  timestamp?: number;
};

type Services = Record<string, Service>

class ServiceRegistry {
  public log: Logger = config.log;
  public services: Services = {};
  public timeout: number = config.serviceTimeout;

  getKey(service: Service) {
    return service.name+service.version+service.ip+service.port
  };

  get(name: string, version?: string) {
    const servicesList = Object.values(this.services).filter((svc) => (
      svc.name === name && semver.satisfies(svc.version, version)
    ));

    return servicesList[0];
  };

  register(service: Service) {
    this.cleanup();
    const key = this.getKey(service);

    if (!this.services[key]){
      const { ip, port, name, version } = service;
      this.services[key] = { name, version, port, ip };
      this.services[key].timestamp = new Date().valueOf();
      this.log.debug(`Added service ${name}, version ${version} at ${ip}:${port}`);
      return key;
    }

    this.services[key].timestamp = new Date().valueOf();
    this.log.debug(`Updated service ${service.name}, version ${service.version} at ${service.ip}:${service.port}`);
    return key;
  };

  unregister(service: Service) {
    const key = this.getKey(service);
    delete this.services[key];
    this.log.debug(`Unregistered service ${service.name}, version ${service.version} at ${service.ip}:${service.port}`);
    return key;
  };

  private cleanup() {
    const now = new Date().valueOf();
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`Removing service ${key}`);
      }
    });
  };
};

const serviceRegistry = new ServiceRegistry();
export default serviceRegistry;