export interface Asset {
  uuid: string;
  name: string;
  networkId: string | undefined;
  ticker: string;
  type: assetMethod;
  contractAddress?: string | null;
  decimal: number | null;
}

export type assetMethod = 'base' | 'erc20' | 'fiat';

export interface ExtendedAsset extends Asset {
  uuid: string;
}
