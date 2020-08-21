import {
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxValue,
  ITxToAddress,
  ITxFromAddress,
  ITxData
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
  | string
  | ITxValue
  | ITxNonce
  | ITxGasLimit
  | ITxGasPrice
  | ITxToAddress
  | ITxFromAddress
  | ITxData;
