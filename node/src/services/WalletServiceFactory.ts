import { CoinTypes } from "../bll/wallets";
import { ClientError } from "../models";
import TronService from "./tronService";
import { Service } from "./WalletBaseService";

class WalletServiceFactory {
  static createService(coin: CoinTypes): Service {
    switch (coin) {
      case CoinTypes.TRX:
        return new TronService();
      default:
        throw new ClientError(400, `Unsupported coin type: ${coin}`);
    }
  }
}

export default WalletServiceFactory;