export interface Asset {
  uuid: string;
  name: string;
  networkId?: string;
  ticker: string;
  type: assetMethod;
  contractAddress?: string;
  decimal?: number;
}

export type assetMethod = 'base' | 'erc20' | 'fiat';

export interface ExtendedAsset extends Asset {
  uuid: string;
}
