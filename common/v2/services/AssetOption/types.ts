export interface AssetOption {
  name: string;
  network: string;
  ticker: string;
  type: assetOptionMethod;
  decimal: number;
  contractAddress: string | null;
}
export type assetOptionMethod = 'base' | 'erc20';
export interface ExtendedAssetOption extends AssetOption {
  uuid: string;
}
