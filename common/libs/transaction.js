// @flow

// TODO: Enforce more bigs, or find better way to avoid ether vs wei for value
export type TransactionWithoutGas = {|
  from: string,
  to: string,
  gasLimit?: string | number,
  value: string | number,
  data?: string,
  chainId?: number
|};

export type Transaction = {|
  ...TransactionWithoutGas,
  gasPrice: string | number
|};

export type RawTransaction = {|
  nonce: string,
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,
  chainId: number
|};

export type BroadcastTransaction = {|
  ...RawTransaction,
  rawTx: string,
  signedTx: string
|};
