import { BigNumber } from 'ethers/utils';
import { NetworkId, TUuid, AssetSocial } from '@types';
import { Brand } from 'utility-types';

export type TTicker = Brand<string, 'Ticker'>;
export type TSymbol = Brand<string, 'Symbol'>;
export type TAssetType = 'base' | 'erc20' | 'fiat';
export type ISwapAsset = Pick<Asset, 'name' | 'ticker' | 'uuid'>;

export interface Fiat {
  code: TTicker;
  name: string;
  symbol: TSymbol;
  prefix?: boolean;
}

export interface Asset {
  readonly uuid: TUuid;
  readonly name: string;
  readonly networkId: NetworkId;
  readonly ticker: TTicker; // The 3 letter curency code to identify an asset.
  readonly symbol?: TSymbol; // The currency symbol to identify an asset eg. €, $
  readonly type: TAssetType;
  readonly contractAddress?: string;
  readonly decimal?: number;
  readonly isCustom?: boolean;
}

export interface ExtendedAsset extends Asset {
  website?: string;
  whitepaper?: string;
  social?: AssetSocial;
  mappings?: {
    coinGeckoId?: string;
    cryptoCompareId?: string;
    coinCapId?: string;
  };
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

export type StoreAsset = ExtendedAsset & {
  balance: BigNumber;
  mtime: number;
  rate?: number;
};
