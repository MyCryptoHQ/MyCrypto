export interface AssetOption {
  name: string;
  network: string;
  ticker: string;
  type: string;
  decimal: number;
  contractAddress: string | null;
}

export interface ExtendedAssetOption extends AssetOption {
  uuid: string;
}
