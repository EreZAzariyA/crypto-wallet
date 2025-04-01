

export enum CoinsType {
  TRX = "TRX",
  ETH = "ETH",
  USDT = "USDT",
  USDC = "USDC",
  USDT_ERC20 = "USDT_ERC20",
  USDC_ERC20 = "USDC_ERC20",
  USDT_TRC20 = "USDT_TRC20",
  USDC_TRC20 = "USDC_TRC20",
};

export const SupportedCoins = [
  CoinsType.TRX,
  CoinsType.ETH,
  CoinsType.USDC_ERC20,
  CoinsType.USDC_TRC20,
  CoinsType.USDT_ERC20,
  CoinsType.USDT_TRC20
];

export const CoinsNames: Partial<Record<CoinsType, string>> = {
  [CoinsType.TRX]: "Tron",
  [CoinsType.ETH]: "Ethereum",
  [CoinsType.USDT]: CoinsType.USDT,
  [CoinsType.USDC]: CoinsType.USDC,
}

export const NetworksList = [
  CoinsType.ETH,
  CoinsType.TRX
];

const CoinsByNetwork = {
  [CoinsType.ETH]: [CoinsType.ETH, CoinsType.USDC_ERC20, CoinsType.USDT_ERC20],
  [CoinsType.TRX]: [CoinsType.TRX, CoinsType.USDC_TRC20, CoinsType.USDT_TRC20]
};

export const getNetworkByCoin = (coin: CoinsType): CoinsType => {
  if (NetworksList.includes(coin)) {
    return coin;
  };

  for (const [network, coins] of Object.entries(CoinsByNetwork)) {
    if (coins.includes(coin)) {
      return (CoinsType as any)[network];
    }
  }

  return undefined;
};

export const CoinSupportedTokens: Partial<Record<CoinsType, CoinsType[]>> = {
  [CoinsType.ETH]: [CoinsType.ETH],
  [CoinsType.TRX]: [CoinsType.TRX],
  [CoinsType.USDC]: [CoinsType.USDC_ERC20, CoinsType.USDC_TRC20],
  [CoinsType.USDT]: [CoinsType.USDT_ERC20, CoinsType.USDT_TRC20],
};

export const SupportedCoinsByNetworks: Partial<Record<CoinsType, CoinsType[]>> = {
  [CoinsType.ETH]: [CoinsType.ETH],
  [CoinsType.TRX]: [CoinsType.TRX],
  [CoinsType.USDC]: [CoinsType.USDC_ERC20, CoinsType.USDC_TRC20],
  [CoinsType.USDT]: [CoinsType.USDT_ERC20, CoinsType.USDT_TRC20],
};

export const getMainCoinByToken = (coin: string) => {
  if (coin.includes('_ERC20') || coin.includes('_TRC20')) {
    const [token] = coin.split('_');
    return token;
  }
  return coin;
}
