import { useWallets } from "../../../../hooks/useWallets";
import { SupportedCoins } from "../../../../utils/helpers";
import { CoinsType } from "../../../../utils/enums";
import { Button, Card, Col, Flex, Row, Spin, Typography } from "antd";
import { useState } from "react";

const EllipsisText = (props: { text: string, copyable?: boolean }) => (
  <Typography.Text
    copyable={props.copyable || false}
    ellipsis={{
      tooltip: {
        title: props.text
      },
    }}
  >
    {props.text}
  </Typography.Text>
);

export const AdminUserWallets = (props: { user_id: string }) => {
  const { wallets, walletsLoading, createWallet } = useWallets({ user_id: props.user_id });
  const [loading, setLoading] = useState<Record<string, boolean>>(null);

  const onCreateWallet = async (coin: CoinsType) => {
    try {
      setLoading({ [coin]: true });
      await createWallet(coin);
    } catch (error: any) {
      console.log({error});
    }
    setLoading({ [coin]: false });
  };

  if (walletsLoading) return <Spin />;
  return (
    <Row gutter={[10, 10]}>
      {SupportedCoins.map((coin) => {
        const wallet = wallets[coin];

        return (
          <Col key={coin} xs={{ span: 24 }} sm={{ span: 12 }}>
            <Card title={coin} style={{ height: '100%' }}>
              <Flex vertical gap={10}>
                {wallet ? (
                  <>
                    <EllipsisText copyable text={`Wallet Address: ${wallet.address}`} />
                    <EllipsisText text={`Wallet Balance: ${wallet.walletBalance}`} />
                  </>
                ) : (
                  <>
                    <Typography.Title level={4}>No Wallet</Typography.Title>
                    <Button type="primary" onClick={() => onCreateWallet(coin)} loading={loading?.[coin]}>Create Wallet</Button>
                  </>
                )}
              </Flex>
            </Card>
          </Col>
        )
      })}
    </Row>
  );
};