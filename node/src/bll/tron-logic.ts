import { Types } from "mongoose";
import { tronWeb } from "../dal";
import { Users } from "../collections";
import { ClientError, IWalletModel } from "../models";
import { Service } from "../services/WalletBaseService";
import { CoinTypes, walletsLogic } from "./wallets";
import { TRXService } from "../services";
import { Trc20ABI, UsdtContractAddress } from "../dal/tronweb";

const getContract = async () => {
  return await tronWeb.contract()
    .at(UsdtContractAddress);
  // console.log('Contract:', contract);
};

export const getUSDTBalance = async (walletAddress: string) => {
  try {
    const usdtContract = await tronWeb.contract(Trc20ABI, UsdtContractAddress);
    const balance = await usdtContract.balanceOf(walletAddress).call();
    const formattedBalance = tronWeb.fromSun(balance.toString());
    return Number(formattedBalance);
  } catch (error) {
    console.error('❌ Error fetching USDT balance:', error);
    throw error;
  }
};

class TronLogic {
  private service: Service = TRXService;

  async createWallet(user_id: string, coin: CoinTypes): Promise<IWalletModel> {
    const wallet = await this.getWallet(user_id);
    if (!!wallet) {
      console.log({ exsitWallet: wallet });
      return wallet;
    }

    const newWallet = await this.service.createWallet(user_id, coin);
    if (!newWallet) {
      throw new ClientError(500, 'TronLogic.createWallet[Warn]: Could not create address');
    }

    return newWallet;
  };

  async getWallet(user_id: string): Promise<IWalletModel> {
    if (!Types.ObjectId.isValid(user_id)){
      throw new ClientError(500, 'User id is not in the correct format');
    }

    const user = await Users.findById(user_id).exec();
    if (!user) {
      throw new ClientError(400, 'User not found');
    }

    let wallet: IWalletModel;
    wallet = await walletsLogic.getUserWalletByCoin(user._id.toString(), this.service.coin);
    if (!!wallet) {
      const walletBalance = await this.getBalance(wallet);
      wallet.walletBalance = walletBalance;
      wallet.save();
      return wallet;
    };

    return wallet;
  };

  async getWalletDetails(address: string): Promise<IWalletModel> {
    await this.validateAddress(address);
    return await tronWeb.trx.getAccount(address);
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

  async fetchWalletTransactions(address: string) {
    try {
      const transactions = await tronWeb.trx.getTransactionsRelated(address, 'all', 10, 0);
      console.log(transactions);
      return transactions;
    } catch (error) {
      throw new ClientError(error.status, error?.message);
    }
  };

};

export const tronLogic = new TronLogic();