import { TxParam } from '@features/SendAssets/preFillTx';

export const MANDATORY_TRANSACTION_QUERY_PARAMS: TxParam[] = [
  'gasLimit',
  'to',
  'data',
  'nonce',
  'from',
  'value',
  'chainId'
];

export const SUPPORTED_TRANSACTION_QUERY_PARAMS: TxParam[] = [
  'type',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
  'gasLimit',
  'to',
  'data',
  'nonce',
  'from',
  'value',
  'chainId'
];
