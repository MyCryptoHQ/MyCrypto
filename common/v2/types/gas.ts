export interface GasEstimates {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
  time: number;
  chainId: number;
  isDefault: boolean;
}

export interface GasPrice {
  min: number;
  max: number;
  initial: number;
}
