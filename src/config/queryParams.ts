import { TxParam } from '@features/SendAssets/preFillTx';

export const MANDATORY_TRANSACTION_QUERY_PARAMS: TxParam[] = [
  'gasPrice',
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
  'gasLimit',
  'to',
  'data',
  'nonce',
  'from',
  'value',
  'chainId'
];
