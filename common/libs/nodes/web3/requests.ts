import RPCRequests from '../rpc/requests';
import {
  SendTransactionRequest,
  SignMessageRequest,
  GetAccountsRequest,
  GetPermissionsRequest,
  RequestPermissionsRequest
} from './types';
import { IHexStrWeb3Transaction } from 'libs/transaction';

export default class Web3Requests extends RPCRequests {
  public sendTransaction(web3Tx: IHexStrWeb3Transaction): SendTransactionRequest {
    return {
      method: 'eth_sendTransaction',
      params: [web3Tx]
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

  public getPermissions(): GetPermissionsRequest {
    return {
      method: 'wallet_getPermissions'
    };
  }

  public requestPermissions(): RequestPermissionsRequest {
    return {
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {}
        }
      ]
    };
  }
}
