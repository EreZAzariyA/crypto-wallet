import { CoinTypes } from "../bll/wallets";
import { ClientError } from "../models";
import ETHService from "./EthService";
import TronService from "./TronService";
import { Service } from "./WalletBaseService";

class WalletServiceFactory {
  static createService(coin: CoinTypes): Service {
    switch (coin) {
      case CoinTypes.TRX:
        return new TronService();
      case CoinTypes.ETH:
        return new ETHService();
      default:
        throw new ClientError(400, `Unsupported coin type: ${coin}`);
    }
  }
}

export default WalletServiceFactory;