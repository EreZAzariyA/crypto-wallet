import axios from "axios";
import Web3, { Transaction, TransactionReceipt, Web3Account } from 'web3';
import config from "../utils/config";
import { Web3Provider } from "../dal";
import { CoinTypes, getNetworkByCoin, NetworksList, TransactionType } from "../bll";
import { Transactions, Wallets } from "../collections";
import { ClientError, ITransaction, IWalletModel, TransactionsStatus, } from "../models";
import WalletBaseService from "./WalletBaseService";
import { isArrayAndNotEmpty, USDT_ERC20_CONTRACT_ABI } from "../utils/helpers";
import BN from 'bn.js';
import { socket } from "../app";

const ETHERSCAN_API_KEY = "8NBT2T4PQ1QB4UKIJXSAZKSXJPD7N3XYJ4";
const USDT_ERC20_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const updateWalletLastScannedBlock = async (wallet: IWalletModel, lastBlock: number) => {
  try {
    await Wallets.updateOne({ address: wallet.address }, { lastScanBlock: lastBlock }).exec();
    config.log.debug(`Wallet ${wallet.address} last scan block updated to ${lastBlock}`);
  } catch (error) {
    throw new ClientError(500, `[EthService.updateWalletLastScannedBlock]: ${error?.message || 'Error'}`);
  }
};

// const fetchUsersTransactions = async (web3: Web3) => {
//   const wallets = await Wallets.find({ name: CoinTypes.ETH }).exec();
//   const walletsList = {};
//   const startBlock = wallets.reduce((acc, wallet) => {
//     return Math.max(acc, wallet.lastScanBlock);
//   }, 0);

//   if (isArrayAndNotEmpty(wallets)) {
//     wallets.forEach((wallet) => {
//       walletsList[wallet.address] = wallet;
//     });
//   }

//   const lastBlock = await web3.eth.getBlockNumber();
//   const ending = Number(lastBlock);

//   config.log.debug(`Scanning Etherscan API (from latest block: ${startBlock} to ${ending})...`);

//   const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${start}&endblock=${ending}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
//   const res = await axios.get(apiUrl);
//   const response = res.data;
  
//   // if (!response) {
//   //   config.log.debug(`Etherscan API Error: ${response.message || "Unknown error"}`);
//   //   return;
//   // } else if (response.result && Array.isArray(response.result)) {
//   //   config.log.debug(`Etherscan API: response ${response.message}`);
//   //   await updateWalletLastScannedBlock(wallet, ending);
//   //   return;
//   // }
// };

// export const scanBlocks = async (web3: Web3) => {
//   const wallets = await Wallets.find({ name: CoinTypes.ETH }).exec();
//   if (!isArrayAndNotEmpty(wallets)) {
//     console.log(`No ETH wallet to scan...`);
//     return;
//   }

//   // Find the highest lastScanBlock across all wallets
//   const startBlock = wallets.reduce((acc, wallet) => Math.max(acc, wallet.lastScanBlock), 0);
//   const lastBlock = await web3.eth.getBlockNumber();
//   const endBlock = Number(lastBlock);

//   console.log(`Scanning blocks from block: ${startBlock} to block: ${endBlock}...`);

//   // Prepare walletsObj mapping addresses to wallets for quick lookup
//   const walletsObj: Record<string, any> = {};
//   wallets.forEach((wallet) => {
//     walletsObj[wallet.address.toLowerCase()] = wallet; // Use lowercase for consistency
//   });

//   let updatedWallets = new Set<string>();

//   for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
//     console.log(`Scanning block ${blockNumber}...`);

//     try {
//       const block = await web3.eth.getBlock(blockNumber, true);
//       if (!block || !block.transactions) continue;

//       // Filter transactions where either 'from' or 'to' is one of our wallet addresses
//       const relevantTxs = block.transactions.filter((tx) => {
//         if (typeof tx === "string") return false; // Skip if tx is a string (invalid tx)
//         return (
//           (tx.from && walletsObj[tx.from.toLowerCase()]) || 
//           (tx.to && walletsObj[tx.to.toLowerCase()])
//         );
//       });

//       if (relevantTxs.length > 0) {
//         console.log(`🚀 Found transactions in block ${blockNumber}:`, relevantTxs);

//         // Mark wallets that had transactions for update
//         relevantTxs.forEach((tx) => {
//           if (typeof tx === "string") return;
//           if (tx.from) updatedWallets.add(tx.from.toLowerCase());
//           if (tx.to) updatedWallets.add(tx.to.toLowerCase());
//         });
//       }

//     } catch (error) {
//       console.error(`Error scanning block ${blockNumber}:`, error);
//     }
//   }

//   // Update lastScanBlock for wallets that had transactions
//   // if (updatedWallets.size > 0) {
//     await Wallets.updateMany(
//       { address: { $in: Object.keys(walletsObj).map((k) => k) } },
//       { $set: { lastScanBlock: endBlock } }
//     ).exec();
//     console.log(`✅ Updated lastScanBlock to ${endBlock} for wallets:`, Object.keys(walletsObj).map((k) => k));
//   // }

//   console.log(`Scan blocks done...`);
// };

export const scanBlocks = async (web3: Web3) => {
  const wallets = await Wallets.find({ name: CoinTypes.ETH }).exec();
  if (!isArrayAndNotEmpty(wallets)) {
    console.log(`No ETH wallet to scan...`);
    return;
  }

  const startBlock = wallets.reduce((acc, wallet) => Math.min(acc, wallet.lastScanBlock), Infinity);

  const lastAvailableBlock = await web3.eth.getBlockNumber();
  const lastBlock = Math.min(startBlock + 50, Number(lastAvailableBlock));
  const endBlock = Number(lastBlock);

  config.log.info(`Scanning blocks from block: ${startBlock} to block: ${endBlock}...`);

  const walletsObj: Record<string, any> = {};
  wallets.forEach((wallet) => {
    walletsObj[wallet.address.toLowerCase()] = wallet;
  });

  for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
    config.log.debug(`Scanning block ${blockNumber}...`);

    try {
      const block = await web3.eth.getBlock(blockNumber, true);
      if (!block || !block.transactions) continue;

      // Filter transactions where either 'from' or 'to' is one of our wallet addresses
      const relevantTxs = block.transactions.filter((tx) => {
        if (typeof tx === "string") return false; // Skip if tx is a string (invalid tx)
        return (
          (tx.from && walletsObj[tx.from.toLowerCase()]) || 
          (tx.to && walletsObj[tx.to.toLowerCase()])
        );
      });

      if (relevantTxs.length > 0) {
        console.log(`🚀 Found transactions in block ${blockNumber}:`, relevantTxs);
        for (const tnx of relevantTxs) {
          if (typeof tnx === 'string') return;

          const senderAddress = tnx.from?.toLowerCase();
          const receiverAddress = tnx.to?.toLowerCase();
          const isSent = senderAddress && walletsObj[senderAddress];
          const receipt = await web3.eth.getTransactionReceipt(tnx.hash);
          const timestamp = Number(block.timestamp) * 1000;
          const date = new Date(timestamp).toISOString();

          const user_id = walletsObj[isSent ? senderAddress : receiverAddress]?.user_id;
          const type = isSent ? TransactionType.Sent : TransactionType.Receive;

          const status = !receipt
            ? "pending"
            : receipt.status
              ? "completed"
              : "denied";

          const addedTransaction = await new Transactions({
            blockNumber: Number(tnx.blockNumber),
            coin: CoinTypes.ETH,
            blockHash: tnx.blockHash,
            from: tnx.from,
            hash: tnx.hash,
            to: tnx.to,
            transactionIndex: Number(tnx.transactionIndex),
            amount: isSent
              ? -Number(web3.utils.fromWei(tnx.value, "ether"))
              : Number(web3.utils.fromWei(tnx.value, "ether")),
            type,
            user_id,
            status,
            date,
          }).save();
          if (!isSent) {
            socket.sendMessage('transaction:new', user_id, {
              coin: addedTransaction.coin,
              from: addedTransaction.from,
              amount: addedTransaction.amount,
              status: addedTransaction.status
            });
          }
          console.log(`✅ Saved trans.`);
        }

      }

    } catch (error) {
      console.error(`Error scanning block ${blockNumber}:`, error);
    }
  }

  console.log(`Scan blocks done...`);
  try {
    await Wallets.updateMany({ network: CoinTypes.ETH }, { lastScanBlock: endBlock }).exec();
  } catch (error) {
    throw new ClientError(500, error?.message);
  }
};

const checkAmount = async (web3: Web3, senderAddress: string, ) => {
  const gasPrice = BigInt(await web3.eth.getGasPrice()); // BigInt
  const gasLimit = BigInt(21000); // Convert to BigInt
  const balance = BigInt(await web3.eth.getBalance(senderAddress)); // BigInt

  const maxSendable = balance - gasPrice * gasLimit;
  return maxSendable;
};

const updateWalletBalance = async (
  web3: Web3,
  tx: Transaction,
  receipt: TransactionReceipt,
  wallet: IWalletModel
) => {
  const sentAmount = new BN(tx.value.toString());

  const gasUsed = new BN(receipt.gasUsed.toString());
  const gasPrice = new BN(receipt.effectiveGasPrice.toString());

  const gasFee = gasUsed.mul(gasPrice);
  const totalSpent = sentAmount.add(gasFee);

  console.log("Sent Amount (Wei):", sentAmount.toString());
  console.log("Gas Fee (Wei):", gasFee.toString());
  console.log("Total Spent (Wei):", totalSpent.toString());

  const totalSpentInEther = web3.utils.fromWei(totalSpent.toString(), "ether");
  console.log("Total Spent (ETH):", totalSpentInEther);

  try {
    wallet.walletBalance -= Number(totalSpentInEther);
    return await wallet.save({
      validateBeforeSave: true,
      timestamps: true,
    });
  } catch (error) {
    throw new ClientError(
      500,
      `Error while trying to calculate the new balance: ${error?.message}`
    );
  }
};

const sendCoinDetails = async () => {

}

class ETHBaseService extends WalletBaseService {
  public coin: CoinTypes = CoinTypes.ETH;

  protected web3 = new Web3(Web3Provider);

  async createWallet(user_id: string, coin: CoinTypes): Promise<IWalletModel> {
    let wallet: Web3Account;
    if (!NetworksList.includes(coin)) {
      USDT_ERC20_CONTRACT_ABI
    } else {
      wallet = this.web3.eth.accounts.create();
    }
      const lastBlock = await this.web3.eth.getBlockNumber();
      const newWallet = {
        name: coin,
        address: wallet.address,
        privateKey: wallet.privateKey,
        lastScanBlock: Number(lastBlock),
        hex: wallet.address,
      };

      return await this.saveWallet(user_id, newWallet);
  };

  async fetchTransactions(address: string): Promise<ITransaction[]> {
    const lastBlock = await this.web3.eth.getBlockNumber();
    const ending = Number(lastBlock);

    const wallet = await Wallets.findOne({ address }).exec();
    const start = wallet?.lastScanBlock || 0;
    config.log.debug(`Scanning Etherscan API (from block: ${start} to ${ending})...`);

    try {
      const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${start}&endblock=${ending}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
      const res = await axios.get(apiUrl);
      const response = res.data;
      
      if (!response) {
        config.log.debug(`Etherscan API Error: ${response.message || "Unknown error"}`);
        return;
      } else if (response.result && Array.isArray(response.result)) {
        config.log.debug(`Etherscan API: response ${response.message}`);
        await updateWalletLastScannedBlock(wallet, ending);
        return;
      }

      const transactions = response.result;
      const transactionsToInsert: ITransaction[] = [];

      for (let trans of transactions) {
        if (!isNaN(Number(trans?.confirmations)) && Number(trans?.confirmations) === 0) {
          trans.status = TransactionsStatus.Pending
        } else if (trans.txreceipt_status === "1") {
          trans.status = TransactionsStatus.Success
        } else {
          trans.status = TransactionsStatus.Denied
        }
        
        const newTrans = new Transactions({
          ...trans,
          coin: this.coin,
          date: new Date(Number(trans.timeStamp) * 1000).toISOString(),
          amount: Number(this.web3.utils.fromWei(trans.value, 'ether'))
        });
        const errors = newTrans.validateSync();
        if (errors) {
          throw new ClientError(500, errors.message);
        }

        transactionsToInsert.push(newTrans);
      }

      const inserted = await Transactions.insertMany(transactionsToInsert);
      config.log.debug(`Imported ${inserted.length || 0} transactions`);
      await updateWalletLastScannedBlock(wallet, ending);
      return transactionsToInsert;
    } catch (error) {
      console.log({ error });
      throw new ClientError(500, 'Error on getTransactions');
    }
  };

  async sendCoin(wallet: IWalletModel, toAddress: string, amountInEth: number): Promise<{ receipt: TransactionReceipt, wallet: IWalletModel }> {
    const value = this.web3.utils.toWei(amountInEth, "ether");

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasPriceEth = this.web3.utils.fromWei(gasPrice, "ether");
    const nonce = await this.web3.eth.getTransactionCount(wallet.address, "latest");
    const maxAmount = await checkAmount(this.web3, wallet.address);
    if (Number(value) > Number(maxAmount)) {
      throw new ClientError(500, `You don't have enough balance for gas price (${gasPriceEth})`);
    }

    try {
      const tx: Transaction = {
        from: wallet.address,
        to: toAddress,
        value: value,
        gas: 21000,
        gasPrice: gasPrice,
        nonce: nonce,
      };

      const signedTx = await this.web3.eth.accounts.signTransaction(tx, wallet.privateKey);
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction!);
      const updatedWallet = await updateWalletBalance(this.web3, tx, receipt, wallet);
      return {
        receipt,
        wallet: updatedWallet
      };
    } catch (error) {
      console.error("Transaction failed:", error?.reason);
      throw new ClientError(500, `Transaction failed: ${error?.reason}`);
    }
  };
};

export default ETHBaseService;
