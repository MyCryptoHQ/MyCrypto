import { TSymbol } from 'v2/types';

export interface ISwapAsset {
  name: string;
  symbol: TSymbol;
}

export enum LAST_CHANGED_AMOUNT {
  FROM = 'FROM_AMOUNT',
  TO = 'TO_AMOUNT'
}
