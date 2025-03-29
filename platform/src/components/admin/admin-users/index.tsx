import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import adminServices, { QueryOptions } from "../../../services/adminServices";
import { Button, Flex, Space, Table, TableProps } from "antd";
import { UserModel } from "../../../models";
import AdminUserPanel from "../AdminUserPanel";

const AdminUsers = () => {
  const [selectedUser, setSelectedUser] = useState<UserModel>(null);
  const [query, setQuery] = useState<QueryOptions>({
    limit: 10,
    skip: 0,
    sort: 'createdAt'
  });

  const { isPending, data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => adminServices.getUsers(query),
  });

  const columns: TableProps<UserModel>['columns'] = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'Email',
      dataIndex: 'emails',
      key: 'email',
      render(_, record) {
        return <p>{record.emails[0].email}</p>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => setSelectedUser(record)}>Details</Button>
        </Space>
      ),
    },
  ];

  if (selectedUser) {
    return (
      <AdminUserPanel
        user={selectedUser}
        back={() => setSelectedUser(null)}
      />
    );
  }

  return (
    <Flex vertical>
      <p>admin</p>
      <Table
        loading={isPending}
        dataSource={data?.users}
        columns={columns}
        scroll={{ x: 600 }}
        rowKey={'_id'}
      />
    </Flex>
  );
};

export default AdminUsers;