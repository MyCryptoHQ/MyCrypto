import { RPCRequests } from '../rpc';
import { SendTransactionRequest, SignMessageRequest, GetAccountsRequest } from './types';
import { ITxObject } from 'v2/types';

export default class Web3Requests extends RPCRequests {
  public sendTransaction({
    to,
    data,
    from,
    gasLimit,
    gasPrice,
    nonce,
    value
  }: ITxObject): SendTransactionRequest {
    return {
      method: 'eth_sendTransaction',
      params: [
        {
          data,
          value,
          from: from!,
          gas: gasLimit,
          gasPrice,
          nonce,
          to
        }
      ]
    };
  }

  public signMessage(msgHex: string, fromAddr: string): SignMessageRequest {
    return {
      method: 'personal_sign',
      params: [msgHex, fromAddr]
    };
  }

  public getAccounts(): GetAccountsRequest {
    return {
      method: 'eth_accounts'
    };
  }
}
