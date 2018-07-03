import EthTx from 'ethereumjs-tx';

import { Address, Wei, TokenValue } from 'libs/units';
import { AppState } from './reducers';

export interface ICurrentValue {
  raw: string;
  value: TokenValue | Wei | null;
}

export interface ICurrentTo {
  raw: string;
  value: Address | null;
}

export interface IGetTransaction {
  transaction: EthTx;
  isFullTransaction: boolean; //if the user has filled all the fields
}

export type TransactionFields = AppState['transaction']['fields'];

export type TransactionFieldValues = {
  [field in keyof TransactionFields]: TransactionFields[field]['value']
};
