import { Button, Card, Collapse, CollapseProps, Descriptions, DescriptionsProps, Flex, Typography } from "antd";
import { AdminUserWallets } from "./AdminUserWallets";
import { UserModel } from "../../../models";

const AdminUserPanel = (props: { user: UserModel, back: () => void }) => {
  const { user } = props;

  const items: CollapseProps['items'] = [
    {
      key: 'wallets',
      label: <Typography.Title level={4}>Wallets</Typography.Title>,
      children: <AdminUserWallets user_id={user?._id} />,
    },
  ];

  const descriptionsItems: DescriptionsProps['items'] = [
    {
      key: 'fname',
      label: 'First Name',
      children: <Typography.Text>{user.profile.first_name}</Typography.Text>,
    },
    {
      key: 'lname',
      label: 'Last Name',
      children: <Typography.Text>{user.profile.last_name}</Typography.Text>,
    },
    {
      key: 'email',
      label: 'Email Address',
      span: 2,
      children: <Typography.Text>{user.emails[0].email}</Typography.Text>,
    },
  ];

  return (
    <Flex vertical gap={10}>
      <Flex>
        <Button type="link" onClick={props.back}>Go Back</Button>
      </Flex>
      <Card title="User Info">
        <Descriptions column={2} bordered layout="vertical" items={descriptionsItems} />
      </Card>
      <Collapse accordion items={items} />
    </Flex>
  );
};

export default AdminUserPanel;