import EthTx from 'ethereumjs-tx';

export interface ICurrentValue {
  raw: string;
  value: null;
}

export interface ICurrentTo {
  raw: string;
  value: null;
}

export interface IGetTransaction {
  transaction: EthTx;
  isFullTransaction: boolean; //if the user has filled all the fields
}

export type TransactionFields = any;

export type TransactionFieldValues = {
  [field in keyof TransactionFields]: TransactionFields[field]['value'];
};
