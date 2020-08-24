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
