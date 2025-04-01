import {List } from "antd";
import { useWallets } from "../../../hooks/useWallets";
import { WalletsListItem } from "./WalletsListItem";
import { useAppSelector } from "../../../redux/store";
import { SupportedCoins } from "../../../utils/coinsUtils";

export const WalletsList = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { wallets, walletsLoading, createWallet } = useWallets({ user_id: user?._id });

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