import {
  GetAccountsRequest,
  GetChainIdRequest,
  GetPermissionsRequest,
  RequestPermissionsRequest,
  SignMessageRequest
} from './types';

export default class Web3Requests {
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

  public getChainId(): GetChainIdRequest {
    return {
      method: 'eth_chainId'
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
