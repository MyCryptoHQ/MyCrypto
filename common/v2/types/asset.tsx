import { TSymbol } from 'v2/types';
import { AssetBalanceObject, Asset } from 'v2/services';

interface IAsset {
  symbol: TSymbol;
  name: string;
  network?: string;
  asset: Asset;
}

export interface ExtendedIAsset {
  asset: IAsset;
  assetObj: AssetBalanceObject;
}

export default IAsset;
