import { useQuery } from "@tanstack/react-query";
import { App, Flex, Pagination, PaginationProps, Table, TableColumnsType, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import transactionsServices from "../../services/transactionsServices";
import { TransactionModel } from "../../models/transaction-model";
import { useState } from "react";
import { Event, useSocketEvents } from "../../hooks/useSocketEvents";
import moment from "moment";

const Transactions = () => {
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const { user } = useAppSelector((state) => state.auth);
  const [pagination, setPagination] = useState<Pick<PaginationProps, 'current' | 'pageSize'>>({ current: 1, pageSize: 10 });

  const { data, isFetching } = useQuery<{transactions: TransactionModel[], total: number }>({
    queryKey: ['transactions', user._id, pagination],
    queryFn: () => transactionsServices.fetchUserTransactions(user._id, {
      limit: pagination.pageSize,
      skip: (pagination.current - 1) * pagination.pageSize
    }),
    enabled: !!user._id,
    initialData: { transactions: [], total: 0 },
    refetchOnWindowFocus: true,
    gcTime: 2000
  });

  const events: Event[] = [
    {
      name: 'transaction:new',
      handler: ({ coin, from, amount }) => {
        console.log({ coin, from, amount });
        
        notification.success({
          message: `Amount of ${amount} added to you wallet.`,
          description: `You have receive amount of ${amount} ${coin} from: ${from}.`
        });
      }
    },
  ];
  useSocketEvents(events);

  const EllipsisCell = ({ value }: { value: string }) => (
    <Typography.Text
      ellipsis={{
        tooltip: {
          title: value
        }
      }}
    >
      {value}
    </Typography.Text>
  );

  const columns: TableColumnsType<TransactionModel> = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (value) => {
        return (<p>{moment(value).format('DD MMM YY, HH:mm')}</p>)
      },
      width: 150
    },
    {
      title: 'Coin',
      dataIndex: 'coin',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'From',
      dataIndex: 'from',
      ellipsis: {
        showTitle: false
      },
      render: (value) => (
        <EllipsisCell value={value} />
      )
    },
    {
      title: 'To',
      dataIndex: 'to',
      ellipsis: {
        showTitle: false
      },
      render: (value) => (
        <EllipsisCell value={value} />
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
    }
  ];

  return (
    <Flex vertical gap={10} className="page-container transactions">
      <Flex vertical justify="flex-start">
        <Typography.Title level={2} className="page-title">{t('pages.transactions')}</Typography.Title>
      </Flex>

      <Table
        loading={isFetching}
        dataSource={data.transactions}
        columns={columns}
        rowKey={'_id'}
        scroll={{ x: 800 }}
        pagination={false}
      />
      <Pagination
        total={data.total}
        pageSize={pagination.pageSize}
        onChange={(page, pageSize) => {
          setPagination({ current: page, pageSize });
        }}
        hideOnSinglePage
      />
    </Flex>
  );
};

export default Transactions;