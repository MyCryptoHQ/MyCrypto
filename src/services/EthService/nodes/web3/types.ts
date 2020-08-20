import { JsonRpcResponse, RPCRequest, RPCRequestBase, DATA, QUANTITY } from '../rpc';

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

export interface GetPermissionsRequest extends RPCRequestBase {
  method: 'wallet_getPermissions';
}

export interface RequestPermissionsRequest extends RPCRequestBase {
  method: 'wallet_requestPermissions';
}

type TWeb3ProviderCallback = (error: string, result: JsonRpcResponse | JsonRpcResponse[]) => any;
type TSendAsync = (request: RPCRequest | any, callback: TWeb3ProviderCallback) => void;

export interface IWeb3Provider {
  sendAsync: TSendAsync;
}
