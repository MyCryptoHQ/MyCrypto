export interface Asset {
  option: string;
  amount: string;
  network: string;
  symbol: string;
  type: assetMethod;
  contractAddress?: string;
  decimal?: number;
}

export type assetMethod = 'base' | 'erc20';

export interface ExtendedAsset extends Asset {
  uuid: string;
}
