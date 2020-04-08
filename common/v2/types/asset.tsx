import { BigNumber } from 'ethers/utils';
import { NetworkId, TSymbol, TUuid } from 'v2/types';
import { Brand } from 'utility-types';

export type TTicker = Brand<string, 'Ticker'>;

export interface Fiat {
  code: string;
  name: string;
  symbol: TSymbol;
  prefix?: boolean;
}

export interface IAsset {
  symbol: TSymbol;
  name: string;
  network?: string;
}

export type TAssetType = 'base' | 'erc20' | 'fiat';

export interface Asset {
  readonly uuid: TUuid;
  readonly name: string;
  readonly networkId?: NetworkId;
  readonly ticker: string;
  readonly symbol?: TSymbol;
  readonly type: TAssetType;
  readonly contractAddress?: string;
  readonly decimal?: number;
  readonly isCustom?: boolean;
}

export interface ExtendedAsset extends Asset {
  uuid: TUuid;
}

export interface ReserveAsset extends Asset {
  reserveExchangeRate: string; // Is a BigNumberJS float string
}

// Used to reference an Asset in a storage Account
export interface AssetBalanceObject {
  readonly uuid: TUuid;
  balance: BigNumber | string;
  mtime: number;
}

export type StoreAsset = Asset & { balance: BigNumber; mtime: number };

export type AssetWithDetails = StoreAsset & {
  details: any;
  rate: number;
};
