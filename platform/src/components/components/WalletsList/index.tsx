import { List } from "antd";
import { SupportedCoins } from "../../../utils/helpers"
import { useWallets } from "../../../hooks/useWallets";
import { WalletsListItem } from "./WalletsListItem";


export const WalletsList = () => {
  const { wallets } = useWallets();

  const coins = SupportedCoins.map((coin) => ({
    coin,
    title: coin
  }));

  return (
    <List
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