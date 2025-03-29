import { useState } from "react";
import { Link } from "react-router-dom";
import { WalletModel } from "../../../models";
import { WithdrawModal } from "../WithdrawModal";
import { Avatar, Button, Flex, List, Modal, Typography } from "antd";
import { CoinsType } from "../../../utils/coinsUtils";

interface WalletsListItemProps {
  wallet: WalletModel;
  coin: CoinsType;
  onCreateWallet: (coin: CoinsType) => Promise<WalletModel>;
}

export const WalletsListItem = (props: WalletsListItemProps) => {
  const { coin, wallet } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCreateWallet = async () => {
    setLoading(true);
    await props.onCreateWallet(coin);
    setLoading(false);
  };

  const actions = wallet ? [
    <Link to={'/transactions'}>
      <Button>Details</Button>
    </Link>,
    <Button onClick={() => setOpen(true)}>Withdraw</Button>,
  ] : [
    <Button type="primary" onClick={onCreateWallet} loading={loading}>Create Wallet</Button>
  ];
  const description = wallet ? wallet.address : `No ${coin} address`;

  return (
    <>
      <List.Item actions={actions}>
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${0}`} />}
          title={<span>{coin}</span>}
          description={
            <Flex vertical>
              {wallet?.walletBalance}
              <Typography.Text
                copyable={!!wallet}
                children={description}
                ellipsis={ wallet && {
                  tooltip: {
                    title: wallet.address
                  }
                }}
              />
            </Flex>
          }
        />
      </List.Item>
      <Modal
        open={open}
        title={<Typography.Title style={{ textAlign: 'center' }} level={4}>{`Send ${coin}`}</Typography.Title>}
        footer={false}
        closable={false}
        onCancel={() => setOpen(false)}
      >
        <WithdrawModal wallet={wallet} handleClose={() => setOpen(false)} />
      </Modal>
    </>
  );
};