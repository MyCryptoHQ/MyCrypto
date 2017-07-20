// @flow

export type TransactionWithoutGas = {|
  from?: string,
  to: string,
  gasPrice?: string,
  value?: string,
  data?: string
|};

export type Transaction = {|
  ...TransactionWithoutGas,
  gas: string
|};
