export interface Asset {
  uuid: string;
  name: string;
  networkId: string;
  ticker: string;
  type: assetMethod;
  contractAddress?: string | null;
  decimal: number | null;
}

export type assetMethod = 'base' | 'erc20';

export interface ExtendedAsset extends Asset {
  uuid: string;
}
