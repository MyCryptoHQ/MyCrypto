import { JsonRpcResponse, RPCRequest, RPCRequestBase, DATA, QUANTITY } from '../rpc/types';

type MESSAGE_HEX = string;
type ADDRESS = string;

export interface SendTransactionRequest extends RPCRequestBase {
  method: 'eth_sendTransaction';
  params: [
    {
      from: DATA;
      to: DATA;
      gas: QUANTITY;
      gasPrice: QUANTITY;
      value: QUANTITY;
      data?: DATA;
      nonce?: QUANTITY;
    }
  ];
}

export interface SignMessageRequest extends RPCRequestBase {
  method: 'personal_sign';
  params: [MESSAGE_HEX, ADDRESS];
}

export interface GetAccountsRequest extends RPCRequestBase {
  method: 'eth_accounts';
}

type TWeb3ProviderCallback = (error: string, result: JsonRpcResponse | JsonRpcResponse[]) => any;
type TSendAsync = (request: RPCRequest | any, callback: TWeb3ProviderCallback) => void;

export interface IWeb3Provider {
  sendAsync: TSendAsync;
}

export interface Web3RequestPermissionsResult {
  '@context': string[];
  invoker: string;
  parentCapability: 'eth_accounts';
  id: string;
  date: number;
  caveats: IWeb3Permission[];
}

export interface Web3RequestPermissionsResponse {
  id: string;
  jsonrpc: string;
  result: Web3RequestPermissionsResult[];
}

export type IWeb3Permission = IPrimaryAccountPermission | IExposedAccountsPermission;

export interface IPrimaryAccountPermission {
  type: 'limitResponseLength';
  value: number;
  name: 'primaryAccountOnly';
}

export interface IExposedAccountsPermission {
  type: 'filterResponse';
  value: string[];
  name: 'exposedAccounts';
}

export interface GetPermissionsRequest extends RPCRequestBase {
  method: 'wallet_getPermissions';
}

export interface RequestPermissionsRequest extends RPCRequestBase {
  method: 'wallet_requestPermissions';
}
