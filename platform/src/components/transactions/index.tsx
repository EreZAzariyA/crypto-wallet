import { Flex, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";

const Transactions = () => {
  const { t } = useTranslation();

  return (
    <Flex vertical gap={10} className="page-container transactions">
      <Flex vertical justify="flex-start">
        <Typography.Title level={2} className="page-title">{t('pages.transactions')}</Typography.Title>
      </Flex>

      <Table />
    </Flex>
  );
};

export default Transactions;