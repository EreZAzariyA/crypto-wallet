import TronWeb from 'tronweb';
import config from '../utils/config';

const tronWeb = new TronWeb({
  fullHost: `https://api.${config.isProduction ? '' : 'shasta.'}trongrid.io`,
  // privateKey: config.tronNode.key
});

export default tronWeb;