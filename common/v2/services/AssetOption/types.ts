export interface AssetOption {
  name: string;
  network: string;
  ticker: string;
  type: assetOptionMethod;
  decimal: number;
  contractAddress: null;
}
export type assetOptionMethod = 'base' | 'call';
export interface ExtendedAssetOption extends AssetOption {
  uuid: string;
}
