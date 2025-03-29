import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Flex, Typography } from "antd";
import { WalletsSelect } from "../components/WalletsSelect";
import { CoinsType } from "../../utils/coinsUtils";
import { useWallets } from "../../hooks/useWallets";
import { useAppSelector } from "../../redux/store";
import { WalletPanel } from "./WalletPanel";


const Wallets = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { wallets, walletsLoading } = useWallets({ user_id: user?._id });

  const [selectedCoin, setSelectedCoin] = useState<CoinsType>(location.state?.coin || CoinsType.TRX);

  return (
    <Flex vertical>
      <p>wallets</p>

      <WalletsSelect
        coin={selectedCoin}
        setCoin={setSelectedCoin}
        wallets={wallets}
        loading={walletsLoading}
      />

      {!selectedCoin && (<Typography.Title>Please select wallet</Typography.Title>)}

      {selectedCoin && (
        <Flex>
          <WalletPanel selectedCoin={selectedCoin} wallet={wallets[selectedCoin]} />
        </Flex>
      )}
    </Flex>
  )
};

export default Wallets;