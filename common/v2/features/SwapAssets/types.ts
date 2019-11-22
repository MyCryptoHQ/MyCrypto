import { TSymbol, StoreAccount, ITxConfig, ITxReceipt } from 'v2/types';

export interface ISwapAsset {
  name: string;
  symbol: TSymbol;
}

export enum LAST_CHANGED_AMOUNT {
  FROM = 'FROM_AMOUNT',
  TO = 'TO_AMOUNT'
}

export interface SwapState {
  assets: ISwapAsset[];
  fromAsset: ISwapAsset;
  fromAmount: string;
  fromAmountError: string;
  isCalculatingFromAmount: boolean;
  toAsset: ISwapAsset;
  toAmount: string;
  toAmountError: string;
  isCalculatingToAmount: boolean;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  swapPrice: number;
  account: StoreAccount;
  isSubmitting: boolean;
  txConfig: ITxConfig;
  rawTransaction: ITxConfig;
  dexTrade: any;
  txReceipt: ITxReceipt | undefined;
}
