import { getService } from ".";
import { CoinTypes } from "../bll";
import circuitBreaker from "../lib/CircuitBreaker";
import config from "../utils/config";

class WalletsService {
  private serviceName: string = 'api-node';
  private serviceRegistryUrl: string = config.serviceRegistry.url;
  private serviceVersion: string = config.serviceRegistry.version;

  async getUserWallets(user_id: string) {
    const { ip, port } = await getService(this.serviceName);
    return circuitBreaker.callService({
      method: 'get',
      url: `http://${ip}:${port}/api/wallets/get-wallets/${user_id}`
    });
  };

  async createWallet(user_id: string, coin: CoinTypes, isAdmin?: boolean) {
    const { ip, port } = await getService(this.serviceName);
    return circuitBreaker.callService({
      method: 'post',
      url: `http://${ip}:${port}/api/wallets/create-wallet`,
      data: { user_id, coin, isAdmin }
    });
  };

    // async createWallet(user_id: string, coin: CoinTypes, isAdmin?: boolean) {
    //   const service = WalletServiceFactory.createService(coin);
    //   const wallet = await service.createWallet(user_id, coin);
    //   if (isAdmin) {
    //     socket.io.to(user_id).emit('admin:wallet:create', wallet);
    //   }
    //   return wallet;
    // };
};

const walletsService = new WalletsService();
export default walletsService;