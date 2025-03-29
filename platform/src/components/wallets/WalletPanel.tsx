import { Flex, Select } from "antd";
import { WalletModel } from "../../models";
import { CoinsType, CoinSupportedTokens, getNetworkByCoin } from "../../utils/coinsUtils";
import { useEffect, useState } from "react";

interface WalletPanelProps {
  selectedCoin: CoinsType;
  wallet: WalletModel;
}

export const WalletPanel = (props: WalletPanelProps) => {
  const { selectedCoin } = props;
  const supportedTokens = CoinSupportedTokens[selectedCoin];

  const [selectedToken, setSelectedToken] = useState(supportedTokens[0]);

  useEffect(() => {
    setSelectedToken(supportedTokens[0]);
  }, [supportedTokens]);

  return (
    <Flex vertical>
      <p>{selectedCoin}</p>
      <Select
        value={selectedToken}
        onChange={(value) => {
          console.log({ value });
          
          setSelectedToken(value);
        }}
        options={supportedTokens.map((network) => ({
          label: getNetworkByCoin(network),
          value: network
        }))}
      />
    </Flex>
  );
};