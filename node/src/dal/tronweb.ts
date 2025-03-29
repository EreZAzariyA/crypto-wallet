import TronWeb, { utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';
import config from '../utils/config';

const fullNode = `https://api.${config.tronNode.isTestNet ? 'shasta.' : ''}trongrid.io`;  // Shasta Testnet (for example)
const solidityNode = `https://api.${config.tronNode.isTestNet ? 'shasta.' : ''}trongrid.io`;
const eventServer = `https://api.${config.tronNode.isTestNet ? 'shasta.' : ''}trongrid.io`;
export const UsdtContractAddress = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
tronWeb.setAddress(UsdtContractAddress);

export const Trc20ABI = [
  {
    "constant": true,
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "View",
    "type": "Function"
  }
];

export default tronWeb;
export {
  TronWebUtils,
  Trx,
  TransactionBuilder,
  Contract,
  Event,
  Plugin
};