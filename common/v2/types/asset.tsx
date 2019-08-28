import { BigNumber } from 'ethers/utils';
import { NetworkId, TSymbol } from 'v2/types';

enum TickerBrand {}
export type TTicker = TickerBrand & string;

export interface IAsset {
  symbol: TSymbol;
  name: string;
  network?: string;
}

export type TAssetType = 'base' | 'erc20' | 'fiat';

export interface Asset {
  readonly uuid: string;
  readonly name: string;
  readonly networkId?: NetworkId;
  readonly ticker: string;
  readonly symbol?: TSymbol;
  readonly type: TAssetType;
  readonly contractAddress?: string;
  readonly decimal?: number;
}

export interface ExtendedAsset extends Asset {
  uuid: string;
}

// Used to reference an Asset in a storage Account
export interface AssetBalanceObject {
  readonly uuid: string;
  balance: BigNumber | string; // @TODO: types select only one.
  mtime: number;
}

export type StoreAsset = Asset & AssetBalanceObject;
