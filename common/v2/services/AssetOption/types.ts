export interface AssetOption {
  name: string;
  network: string;
  ticker: string;
  type: assetType;
  decimal: number;
  contractAddress: string | null;
}

export interface ExtendedAssetOption extends AssetOption {
  uuid: string;
}

export type assetType = 'base' | 'erc20';
