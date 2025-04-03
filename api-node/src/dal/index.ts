import Web3 from "web3";
import config from "../utils/config";
import TronWeb from 'tronweb';
import { connect, Connection } from "mongoose";

const { isTestNet, key } = config.ethNode;
const network = isTestNet ? 'sepolia': 'mainnet'

export const Web3Provider = new Web3
  .providers.HttpProvider(`https://${network}.infura.io/v3/${key}`);

export const tronWeb = new TronWeb({
  fullHost: `https://api.${config.isProduction ? '' : 'shasta.'}trongrid.io`,
  headers: { "TRON-PRO-API-KEY": config.tronNode.key },
  // privateKey: config.tronNode.key
});

class Mongoose {
  public db: Connection;

  async connectToMongoDB(): Promise<string> {
    const connection = await connect(config.mongoConnectionString);
    this.db = connection.connections[0];
    return connection.connections[0].name;
  };
}

export const mongoose = new Mongoose();