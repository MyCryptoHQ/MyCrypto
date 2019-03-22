export interface AssetOption {
  name: string;
  network: string;
  ticker: string;
  type: string;
  decimal: number;
  contractAddress: null;
}

export interface ExtendedAssetOption extends AssetOption {
  uuid: string;
}
