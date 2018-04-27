import { SignTransactionParams, SignTransactionResponse } from 'shared/enclave/types';

export default function(params: SignTransactionParams): SignTransactionResponse {
  console.log('Sign transaction called with', params);
  return {
    s: 'test',
    v: 'test',
    r: 'test'
  };
}
