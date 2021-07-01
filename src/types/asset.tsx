import { BigNumber } from '@ethersproject/bignumber';
import { Brand } from 'utility-types';

import { AssetSocial, NetworkId, TAddress, TUuid } from '@types';

export type TTicker = Brand<string, 'Ticker'>;
export type TFiatTicker = Brand<TTicker, 'FiatTicker'>;
export type TCurrencySymbol = Brand<string, 'Symbol'>;
export type TAssetType = 'base' | 'erc20' | 'fiat';
export type ISwapAsset = Pick<Asset, 'name' | 'ticker' | 'uuid' | 'decimal' | 'contractAddress'>;

export interface Fiat {
  name: string;
  ticker: TFiatTicker;
  symbol: TCurrencySymbol;
  prefix?: boolean;
}

export interface IProvidersMappings {
  readonly coinGeckoId?: string;
  readonly cryptoCompareId?: string;
  readonly coinCapId?: string;
}

export interface Asset {
  readonly uuid: TUuid;
  readonly name: string;
  readonly networkId: NetworkId;
  readonly ticker: TTicker; // The 3 letter curency code to identify an asset.
  readonly type: TAssetType;
  readonly contractAddress?: TAddress | string;
  readonly decimal?: number;
  readonly isCustom?: boolean;
  readonly isSwapRelevant?: boolean;
}

export interface ExtendedAsset extends Asset {
  website?: string;
  whitepaper?: string;
  social?: AssetSocial;
  mappings?: IProvidersMappings;
}

export interface ReserveAsset extends Asset {
  reserveExchangeRate: string; // Is a BigNumberJS float string
}

// Used to reference an Asset in a storage Account
export interface AssetBalanceObject {
  readonly uuid: TUuid;
  balance: BigNumber | string;
}

export type StoreAsset = ExtendedAsset & {
  balance: BigNumber;
  rate?: number;
};
