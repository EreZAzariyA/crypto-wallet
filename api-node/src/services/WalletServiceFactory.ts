import { ClientError } from "../models";
import ETHBaseService from "./ETHBaseService";
import TronBaseService from "./TronBaseService";
import { Service } from "./WalletBaseService";
import { CoinTypes, getNetworkByCoin } from "../utils/coins";

class WalletServiceFactory {
  static createService(coin: CoinTypes): Service {
    const network = getNetworkByCoin(coin);
    switch (network) {
      case CoinTypes.TRX:
        return new TronBaseService();
      case CoinTypes.ETH:
        return new ETHBaseService();
      default:
        throw new ClientError(400, `Unsupported coin type: ${coin}`);
    }
  }
}

export default WalletServiceFactory;