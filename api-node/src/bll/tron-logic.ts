import { Wallets } from "../collections";
import { tronWeb } from "../dal";
import { ClientError, IWalletModel } from "../models";
import { CoinTypes } from "../utils/coins";
import { Trc20ABI, UsdtContractAddress } from "../utils/helpers";

export const getUSDTBalance = async (walletAddress: string) => {
  try {
    const usdtContract = await tronWeb.contract(Trc20ABI, UsdtContractAddress);
    console.log(usdtContract);
    
    const balance = await usdtContract.balanceOf(walletAddress).call();
    const formattedBalance = tronWeb.fromSun(balance.toString());
    return Number(formattedBalance);
  } catch (error) {
    console.error('❌ Error fetching USDT balance:', error);
    throw error;
  }
};

class TronLogic {
  public tron = tronWeb;

  async createWallet() {
    const newAccount = await tronWeb.createAccount();
    return { ...newAccount, name: 'TRON' };
  };

  async getBalance(wallet: IWalletModel): Promise<number> {
    await this.validateAddress(wallet.address);
    if (wallet.name === CoinTypes.USDT_TRC20) {
      return await getUSDTBalance(wallet.address);
    }
    const balance = await tronWeb.trx.getBalance(wallet.address);
    return balance / 1_000_000;
  };

  async validateAddress(address: string) {
    const isValidAddress = await tronWeb.isAddress(address);
    if (!isValidAddress) {
      throw new ClientError(400, 'Address is not valid');
    }
    return isValidAddress;
  }
};

export const tronLogic = new TronLogic();