class WalletModel {
  public _id: string;
  public name: string;
  public user_id: string;
  public isTestNet: boolean;
  public privateKey: string;
  public publicKey: string;
  public address: string;
  public walletBalance: number;
};

export default WalletModel;