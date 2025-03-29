import { App, List } from "antd";
import { SupportedCoins } from "../../../utils/helpers"
import { useWallets } from "../../../hooks/useWallets";
import { WalletsListItem } from "./WalletsListItem";
import { useAppSelector } from "../../../redux/store";
import { useSocketEvents, Event } from "../../../hooks/useSocketEvents";
import { WalletModel } from "../../../models";

export const WalletsList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { wallets, walletsLoading, refetch } = useWallets({ user_id: user?._id });
  const { notification } = App.useApp();

  const events: Event[] = [{
    name: 'admin:wallet:create',
    handler: (wallet: WalletModel) => {
      refetch();
      notification.success({
        message: `Wallet ${wallet.name} created.`,
        description: `Admin created ${wallet.name} wallet for you.`
      });
    }
  }];
  useSocketEvents(events);

  const coins = SupportedCoins.map((coin) => ({
    coin,
    title: coin
  }));

  return (
    <List
      loading={walletsLoading}
      itemLayout="horizontal"
      dataSource={coins}
      renderItem={({ coin }) => (
        <WalletsListItem
          key={coin}
          wallet={wallets[coin]}
          coin={coin}
        />
      )}
    />
  );
};