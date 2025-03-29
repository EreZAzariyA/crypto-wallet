import { App, List } from "antd";
import { useWallets } from "../../../hooks/useWallets";
import { WalletsListItem } from "./WalletsListItem";
import { useAppSelector } from "../../../redux/store";
import { useSocketEvents, Event } from "../../../hooks/useSocketEvents";
import { WalletModel } from "../../../models";
import { SupportedCoins } from "../../../utils/coinsUtils";

export const WalletsList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { wallets, walletsLoading, createWallet, refetch } = useWallets({ user_id: user?._id });
  const { notification } = App.useApp();

  const events: Event[] = [
    {
      name: 'admin:wallet:create',
      handler: (wallet: WalletModel) => {
        refetch();
        notification.success({
          message: `Wallet ${wallet.name} created.`,
          description: `Admin created ${wallet.name} wallet for you.`
        });
      }
    },
    {
      name: 'wallet-balance',
      handler: ({ coin, wallet, balance }) => {
        refetch()
        notification.success({
          message: `Wallet ${wallet?.name} balance updated.`,
          description: `Balance for ${coin} updated to ${balance}`
        });
      }
    },
  ];
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
          onCreateWallet={createWallet}
        />
      )}
    />
  );
};