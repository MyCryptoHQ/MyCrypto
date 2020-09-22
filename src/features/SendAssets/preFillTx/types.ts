import {
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue,
  TxQueryTypes
} from '@types';

export type TxParam =
  | 'to'
  | 'data'
  | 'value'
  | 'gasLimit'
  | 'gasPrice'
  | 'from'
  | 'chainId'
  | 'nonce'
  | 'type';

export type TTxQueryParam =
  | TxQueryTypes
  | string
  | ITxValue
  | ITxNonce
  | ITxGasLimit
  | ITxGasPrice
  | ITxToAddress
  | ITxFromAddress
  | ITxData;
