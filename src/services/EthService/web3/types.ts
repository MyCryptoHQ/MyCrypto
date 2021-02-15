import { JsonRPCResponse } from '@types';

type MESSAGE_HEX = string;
type ADDRESS = string;

export interface RPCRequestBase {
  method: string;
  params?: any[];
}

export interface SignMessageRequest extends RPCRequestBase {
  method: 'personal_sign';
  params: [MESSAGE_HEX, ADDRESS];
}

export interface GetAccountsRequest extends RPCRequestBase {
  method: 'eth_accounts';
}

export interface GetChainIdRequest extends RPCRequestBase {
  method: 'eth_chainId';
}

export interface GetPermissionsRequest extends RPCRequestBase {
  method: 'wallet_getPermissions';
}

export interface RequestPermissionsRequest extends RPCRequestBase {
  method: 'wallet_requestPermissions';
}

export type Web3Request =
  | SignMessageRequest
  | GetAccountsRequest
  | GetChainIdRequest
  | GetPermissionsRequest
  | RequestPermissionsRequest;

type TWeb3ProviderCallback = (error: string, result: JsonRPCResponse) => any;
type TSendAsync = (request: Web3Request, callback: TWeb3ProviderCallback) => void;

export interface IWeb3Provider {
  sendAsync: TSendAsync;
}
