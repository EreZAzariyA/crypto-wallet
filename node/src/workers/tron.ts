import cron from "node-cron";
import { CoinTypes } from "../bll/wallets";
import Wallets from "../models/wallet-model";
import tronLogic from "../bll/tron-logic";
import config from "../utils/config";
import { socket } from "../app";
import Web3 from "web3";
import Web3Provider from "../dal/web3";

const updateUsersTronBalance = async () => {
  const coin = CoinTypes.TRX
  const tronWallets = await Wallets.find({ name: coin }).exec();
  if (Array.isArray(tronWallets) && tronWallets.length) {

    for (const wallet of tronWallets) {
      const walletBalance = await tronLogic.getBalance(wallet.address);

      if (wallet.walletBalance !== walletBalance) {
        wallet.walletBalance = walletBalance;
        wallet.save();
        config.log.info(`Balance for TRX wallet ${wallet._id} updated to ${walletBalance}`);
        socket.io.to(wallet.user_id.toString()).emit('wallet-balance', { coin, wallet });
      }
    }
  }
};
const web3 = new Web3(Web3Provider);

const updateUsersETHBalance = async () => {
  const coin = CoinTypes.ETH;
  const ethWallets = await Wallets.find({ name: coin }).exec();
  if (Array.isArray(ethWallets) && ethWallets.length) {
    for (const wallet of ethWallets) {

      const bigintBalance = await web3.eth.getBalance(wallet.address);
      const balanceInEther = web3.utils.fromWei(bigintBalance, 'ether');
      const  balance = Number(balanceInEther);

      if (wallet.walletBalance !== balance) {
        wallet.walletBalance = balance
        wallet.save();
        config.log.info(`Balance for ${coin} wallet ${wallet._id} updated to ${balance}`);
        socket.io.to(wallet.user_id.toString()).emit('wallet-balance', { coin, wallet });
      }
    }
  }
};

export const tronJob = cron.schedule("*/30 * * * * *", async () => {
  console.log("Checking balance for TRX wallets", new Date().toLocaleString());
  await updateUsersTronBalance();
});
export const ethJob = cron.schedule("*/30 * * * * *", async () => {
  console.log("Checking balance for ETH wallets", new Date().toLocaleString());
  await updateUsersETHBalance();
});

