import { JsonRpcResponse, RPCRequest, RPCRequestBase } from '../rpc';

type MESSAGE_HEX = string;
type ADDRESS = string;

export interface SendTransactionRequest extends RPCRequestBase {
  method: 'eth_sendTransaction';
  params: [
    {
      from: string;
      to: string;
      gas: string;
      gasPrice: string;
      value: string;
      data?: string;
      nonce?: string;
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
