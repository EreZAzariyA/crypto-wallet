import { Button, Flex, Space, Typography } from "antd";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { SupportedCoins } from "../../utils/helpers";
import { CoinsType } from "../../utils/enums";
import { createWalletAction } from "../../redux/actions/wallets-actions";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((state) => state.wallets);
  const { user_id } = useAppSelector((state) => state.auth);

  const createWallet = async (coin: CoinsType) => {
    try {
      await dispatch(createWalletAction({ user_id, coin })).unwrap();
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <Flex vertical gap={10} className="page-container dashboard">
      <Flex align="center" justify="space-between">
        <Flex vertical justify="flex-start">
          <Typography.Title level={2} className="page-title">{t('pages.dashboard')}</Typography.Title>
        </Flex>
      </Flex>

      <Space direction="vertical" size={"large"}>
        {SupportedCoins.map((coin) => {
          const wallet = wallets[coin];
          return (
            <div key={coin}>
              <h3>{coin}</h3>
              {wallet ? (
                <Space size={0} direction="vertical">
                  <p>Address: {wallet.address.base58}</p>
                  <p>Is testNet: {JSON.stringify(wallet.isTestNet)}</p>
                  <p>Balance: {wallet.walletBalance}</p>
                </Space>
              ) : (
                <Space>
                  <p>No wallet</p>
                  <Button onClick={() => createWallet(coin)}>Create wallet</Button>
                </Space>
              )}
            </div>
          )
        })}

      </Space>
    </Flex>
  );
};

export default Dashboard;