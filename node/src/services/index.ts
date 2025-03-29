import { CoinTypes } from "../bll";
import WalletServiceFactory from "./WalletServiceFactory";

const ETHService = WalletServiceFactory.createService(CoinTypes.ETH);
const TRXService = WalletServiceFactory.createService(CoinTypes.TRX);

export {
  ETHService,
  TRXService
};