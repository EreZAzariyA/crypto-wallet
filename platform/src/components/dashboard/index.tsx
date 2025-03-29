import { Flex, Typography } from "antd";
import "./Dashboard.css";
import { useTranslation } from "react-i18next";
import { WalletsList } from "../components/WalletsList";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Flex vertical gap={10} className="page-container dashboard">
      <Flex justify="flex-start">
        <Typography.Title level={2} className="page-title">{t('pages.dashboard')}</Typography.Title>
      </Flex>
      <WalletsList />
    </Flex>
  );
};

export default Dashboard;