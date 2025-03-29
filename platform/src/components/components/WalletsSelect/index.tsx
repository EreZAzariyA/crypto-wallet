import { WalletModel } from "../../../models";
import { CoinsNames, CoinsType, SupportedCoins } from "../../../utils/coinsUtils";
import { Flex, Select, Typography } from "antd";

interface WalletsSelectProps {
  coin: CoinsType;
  setCoin: (coin: CoinsType) => void;
  wallets: Record<string, WalletModel>;
  loading: boolean;
}

export const WalletsSelect = (props: WalletsSelectProps) => {

  const coins = SupportedCoins.map((coin) => ({
    coin,
    wallet: props.wallets[coin],
  }));

  const onChange = (value: CoinsType) => {
    props.setCoin(value);
  };

  return (
    <Select
      loading={props.loading}
      onChange={onChange}
      value={props.coin}
      style={{
        height: 'auto',
      }}
    >
      {coins.map(({ coin, wallet }) => (
        <Select.Option key={coin}>
          <Flex vertical style={{ padding: '0.5rem' }}>
            <Flex align="center" justify="space-between">
              <Typography.Text strong>{coin}</Typography.Text>
              <Typography.Text strong>{wallet?.walletBalance || 0}</Typography.Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Typography.Text>{CoinsNames[coin]}</Typography.Text>
              <Typography.Text>{"Coin Rate $"}</Typography.Text>
            </Flex>
          </Flex>
        </Select.Option>
      ))}
    </Select>
  );
};