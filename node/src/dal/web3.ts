import Web3 from "web3";
import config from "../utils/config";


const { isTestNet, key } = config.ethNode;
const network = isTestNet ? 'sepolia': 'mainnet'

const Web3Provider = new Web3
  .providers.HttpProvider(`https://${network}.infura.io/v3/${key}`);

export default Web3Provider;