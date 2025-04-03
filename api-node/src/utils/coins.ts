export enum CoinTypes {
  TRX = "TRX",
  ETH = "ETH",
  USDT_ERC20 = "USDT_ERC20",
  USDC_ERC20 = "USDC_ERC20",
  USDT_TRC20 = "USDT_TRC20",
  USDC_TRC20 = "USDC_TRC20",
};

export enum TransactionType {
  Sent = "Sent",
  Receive = "Receive"
};

export const NetworksList = [
  CoinTypes.ETH,
  CoinTypes.TRX
];

export const CoinsByNetwork = {
  [CoinTypes.ETH]: [CoinTypes.ETH, CoinTypes.USDC_ERC20, CoinTypes.USDT_ERC20],
  [CoinTypes.TRX]: [CoinTypes.TRX, CoinTypes.USDT_TRC20, CoinTypes.USDC_TRC20]
};

export const getNetworkByCoin = (coin: CoinTypes): CoinTypes => {
  if (NetworksList.includes(coin)) {
    return coin;
  };

  for (const [network, coins] of Object.entries(CoinsByNetwork)) {
    if (coins.includes(coin)) {
      return CoinTypes[network];
    }
  }

  return undefined;
};


export const isCoinSupported = (coin: CoinTypes): Boolean => {
  return Object.values(CoinTypes).includes(coin.toUpperCase() as CoinTypes);
};