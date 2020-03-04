import { TSymbol, StoreAccount, ITxConfig, ITxReceipt, ITxObject } from 'v2/types';

export interface ISwapAsset {
  name: string;
  symbol: TSymbol;
}

export enum LAST_CHANGED_AMOUNT {
  FROM = 'FROM_AMOUNT',
  TO = 'TO_AMOUNT'
}

export interface SwapDisplayData {
  fromAsset: ISwapAsset;
  fromAmount: string;
  toAsset: ISwapAsset;
  toAmount: string;
}

export interface SwapState extends SwapDisplayData {
  account: StoreAccount;
  isSubmitting: boolean;
  txConfig: ITxConfig;
  rawTransaction: ITxObject;
  dexTrade: any;
  txReceipt: ITxReceipt | undefined;
}

export interface SwapFormState extends SwapDisplayData {
  account: StoreAccount;
  assets: ISwapAsset[];
  fromAmountError: string | JSX.Element;
  isCalculatingFromAmount: boolean;
  toAmountError: string | JSX.Element;
  isCalculatingToAmount: boolean;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  initialToAmount: string; // This is used to reverse the fee calculation when inputing the recipient amount. It's how we determine the fee.
  exchangeRate: string; // The exchange rate displayed to the user (post-markup)
  markup: string;
  isMulti: boolean;
  dexTrade: any;
}
