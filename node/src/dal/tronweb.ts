import TronWeb, { utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';
import config from '../utils/config';

const tronWeb = new TronWeb({
  fullHost: `https://api.${config.tronNode.isTestNet ? 'shasta.' : ''}trongrid.io`,
  headers: { 'TRON-PRO-API-KEY': config.tronNode.key }
});

export default tronWeb;
export {
  TronWebUtils,
  Trx,
  TransactionBuilder,
  Contract,
  Event,
  Plugin
};