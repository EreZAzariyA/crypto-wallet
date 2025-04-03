import axios from "axios";
import { CoinTypes } from "../bll";
import WalletServiceFactory from "./WalletServiceFactory";
import config from "../utils/config";

export interface Service {
  name: string;
  version: string;
  port: string;
  ip: string;
  timestamp?: number;
};

export const getService = async (servicename: string, version: string = '1'): Promise<Service> => {
  const res = await axios.get(`${config.serviceRegistry.url}find/${servicename}/${version}`);
  return res.data;
};

const ETHService = WalletServiceFactory.createService(CoinTypes.ETH);
const TRXService = WalletServiceFactory.createService(CoinTypes.TRX);

export {
  ETHService,
  TRXService
};