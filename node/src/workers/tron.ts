import cron from "node-cron";
import { CoinTypes } from "../bll/wallets";
import Wallets from "../models/wallet-model";
import tronLogic from "../bll/tron-logic";
import config from "../utils/config";
import { socket } from "../app";

const coin = CoinTypes.TRX;

const updateUsersBalance = async () => {
  const tronWallets = await Wallets.find({ name: coin }).exec();
  if (Array.isArray(tronWallets) && tronWallets.length) {

    for (const wallet of tronWallets) {
      const walletBalance = await tronLogic.getBalance(wallet.address.base58);
      console.log(wallet.walletBalance, walletBalance);
      
      if (wallet.walletBalance !== walletBalance) {
        wallet.walletBalance = walletBalance;
        wallet.save();
        config.log.info(`Balance for TRX wallet ${wallet._id} updated to ${walletBalance}`);
        socket.io.to(wallet.user_id.toString()).emit('wallet-balance', { coin, wallet });
      }
    }
  }
}

export const tronJob = cron.schedule("*/30 * * * * *", async () => {
  console.log("Checking balance for wallets", new Date().toLocaleString());
  await updateUsersBalance();
});

