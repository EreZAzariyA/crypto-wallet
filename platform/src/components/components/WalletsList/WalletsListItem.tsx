import { Avatar, Button, List, Typography } from "antd";
import { WalletModel } from "../../../models";
import { CoinsType } from "../../../utils/enums";
import { useWallets } from "../../../hooks/useWallets";
import { useState } from "react";
import { Link } from "react-router-dom";

export const WalletsListItem = (props: { coin: CoinsType, wallet: WalletModel }) => {
  const { coin, wallet } = props;
  const { createWallet } = useWallets();

  const [loading, setLoading] = useState(false);

  const onCreateWallet = async () => {
    setLoading(true);
    await createWallet(coin);
    setLoading(false);
  };

  const actions = wallet ? [
    <Link to={'/transactions'}>
      <Button>Details</Button>
    </Link>,
    <Button>Withdraw</Button>,
  ] : [
    <Button type="primary" onClick={onCreateWallet} loading={loading}>Create Wallet</Button>
  ];
  const description = wallet ? wallet.address : `No ${coin} address`;

  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${0}`} />}
        title={<a href="https://ant.design">{coin}</a>}
        description={
          <Typography.Text
            copyable={!!wallet}
            children={description}
            ellipsis={ wallet && {
              tooltip: {
                title: wallet.address
              }
            }}
          />
        }
      />
    </List.Item>
  );
};