import { BigNumber } from 'bignumber.js';

import { StoreAccount, ITxObject, ITxStatus, ISwapAsset } from '@types';

export enum LAST_CHANGED_AMOUNT {
  FROM = 'FROM_AMOUNT',
  TO = 'TO_AMOUNT'
}

export interface TxEnveloppe {
  label: string;
  rawTx: ITxObject;
  txHash: string;
  status: ITxStatus;
  queuePos: number;
}

export interface SwapState {
  transactions: TxEnveloppe[];
  currentTxIndex: number;
  assetPair?: IAssetPair;
  account?: StoreAccount;
  isSubmitting: boolean;
  nextInFlow: boolean;
}

export interface SwapFormState {
  account: StoreAccount;
  assets: ISwapAsset[];
  fromAsset: ISwapAsset;
  fromAmount: string;
  toAsset: ISwapAsset;
  toAmount: string;
  fromAmountError: string | JSX.Element;
  isCalculatingFromAmount: boolean;
  toAmountError: string | JSX.Element;
  isCalculatingToAmount: boolean;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  initialToAmount: string; // This is used to reverse the fee calculation when inputing the recipient amount. It's how we determine the fee.
  exchangeRate: string; // The exchange rate displayed to the user (post-markup)
  markup: string;
  isMulti: boolean;
}

export interface IAssetPair {
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: BigNumber;
  toAmount: BigNumber;
  rate: BigNumber;
  markup: BigNumber;
}

export type SwapDisplayData = Pick<IAssetPair, 'fromAsset' | 'toAsset' | 'fromAmount' | 'toAmount'>;
