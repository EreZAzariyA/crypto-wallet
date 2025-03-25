import tronWeb from "../dal/tronweb";

class TronService {
  public tron = tronWeb;

  async createWallet() {
    const newAccount = await tronWeb.createAccount();
    return { ...newAccount, name: 'TRON' };
  };

  async getBalance(address: string) {
    const balance = await tronWeb.trx.getBalance(address);
    return balance / 1_000_000;
  };

};

const tronService = new TronService();
export default tronService;