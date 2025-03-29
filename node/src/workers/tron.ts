import cron from "node-cron";
import Web3 from "web3";
import config from "../utils/config";
import { Web3Provider } from "../dal";
import { Wallets } from "../collections";
import { tronLogic, CoinTypes } from "../bll";
import { socket } from "../app";
import WalletServiceFactory from "../services/WalletServiceFactory";
import { scanBlocks } from "../services/ETHBaseService";

const updateUsersTronBalance = async () => {
  const coin = CoinTypes.TRX
  const tronWallets = await Wallets.find({ network: coin }).exec();
  if (Array.isArray(tronWallets) && tronWallets.length) {

    for (const wallet of tronWallets) {
      const walletBalance = await tronLogic.getBalance(wallet);

      if (wallet.walletBalance !== walletBalance) {
        wallet.walletBalance = walletBalance;
        wallet.save();
        config.log.info(`Balance for TRX wallet ${wallet._id} updated to ${walletBalance}`);
        socket.sendMessage('wallet-balance', wallet.user_id.toString(), { coin: wallet.name, wallet });
      }
    }
  }
};
const web3 = new Web3(Web3Provider);
const ethService = WalletServiceFactory.createService(CoinTypes.ETH);

const updateUsersETHBalance = async () => {
  const coin = ethService.coin;
  // const ethMainWallets = await Wallets.findOne({ address: '0x5557bfD1BC26Ee1A635dABf451b812A9A888bBA0' }).exec();
  // if (ethMainWallets) {
  //   try {
  //     console.log('main wallet found, sending eth...');
  //     await ethService.sendCoin(ethMainWallets, '0x7a8439ee2eEbED79B52486dCBE42C7b6B1128beF', '0.0015');
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // }
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
        socket.sendMessage('wallet-balance', wallet.user_id.toString(), { coin, wallet, balance });
      }
    }
  }
};

export const tronJob = cron.schedule("*/30 * * * * *", async () => {
  console.log("Checking TRX address", new Date().toLocaleString());
  await updateUsersTronBalance();
});
export const ethJob = cron.schedule("*/30 * * * * *", async () => {
  console.log("Checking ETH address", new Date().toLocaleString());
  await updateUsersETHBalance();
  await scanBlocks(web3);
});

