import { WalletModel } from "../../../models";
import { Button, Form, Input, InputNumber, Result } from 'antd';
// import walletServices from "../../../services/wallets";
import { useState } from "react";
import { sendCoinsAction } from "../../../redux/actions/wallets-actions";
import { useAppDispatch } from "../../../redux/store";

interface WithdrawModalProps {
  wallet: WalletModel;
  handleClose: () => void
};

export const WithdrawModal = (props: WithdrawModalProps) => {
  const { wallet } = props;
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const dispatch = useAppDispatch();

  const sendCoin = async (values: Pick<WalletModel, 'address'> & { amount: number }) => {
    try {
      setLoading(true)
      const res = await dispatch(sendCoinsAction({
        wallet,
        to: values.address,
        amount: values.amount
      })).unwrap();
      console.log(res);
      setRes(res);
    } catch (error) {
      console.log({ error });
    }
    setLoading(false);
  };

  if (res) {
    return (
      <Result
        status="success"
        title="Successfully Purchased Cloud Server ECS!"
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button type="primary" key="console" onClick={() => props.handleClose()}>
            Go Console
          </Button>,
        ]}
      />
    );
  };

  return (
    <Form onFinish={sendCoin} layout="vertical">
      <Form.Item
        label='Address'
        name={'address'}
        rules={[{ required: true, message: 'Address is missing' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Amount'
        name={'amount'}
        rules={[
          { required: true, message: 'Amount is missing' },
          { validator(_, value) {
            return new Promise((resolve, reject) => {
              if (!value || value === 0) {
                return reject('Please enter amount');
              }
              if (value > wallet.walletBalance) {
                reject(`Maximum amount is ${wallet.walletBalance}`)
              }
              resolve(true);
            })
          }}
        ]}
      >
        <InputNumber<number>
          min={0}
          // max={wallets[selectedWallet].walletBalance}
        />
      </Form.Item>
      <Button htmlType="submit">Send</Button>
    </Form>
  );
};