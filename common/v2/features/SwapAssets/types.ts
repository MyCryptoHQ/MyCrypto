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
  fromAmountError: string | JSX.Element;
  isCalculatingFromAmount: boolean;
  toAsset: ISwapAsset;
  toAmount: string;
  toAmountError: string | JSX.Element;
  isCalculatingToAmount: boolean;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  account: StoreAccount;
  isSubmitting: boolean;
  txConfig: ITxConfig;
  rawTransaction: ITxConfig;
  dexTrade: any;
  txReceipt: ITxReceipt | undefined;
  initialToAmount: string; // This is used to reverse the fee calculation when inputing the recipient amount. It's how we determine the fee.
  exchangeRate: string; // The exchange rate displayed to the user (post-markup)
  markup: string;
}
