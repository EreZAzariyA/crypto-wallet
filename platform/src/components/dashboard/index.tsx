import { Flex, Typography } from "antd";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import { WalletsList } from "../components/WalletsList";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Flex vertical gap={10} className="page-container dashboard">
      <Flex align="center" justify="space-between">
        <Flex vertical justify="flex-start">
          <Typography.Title level={2} className="page-title">{t('pages.dashboard')}</Typography.Title>
        </Flex>
      </Flex>
      <WalletsList />

      {/* <Space direction="vertical" size={"large"}>
        {SupportedCoins.map((coin) => {
          const wallet = wallets[coin];
          return (
            <div key={coin}>
              <h3>{coin}</h3>
              {wallet ? (
                <Space size={0} direction="vertical">
                  <p>Address: {wallet.address}</p>
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

      </Space> */}
    </Flex>
  );
};

export default Dashboard;