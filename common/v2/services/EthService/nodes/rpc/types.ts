import { ITxObject } from 'v2/types';

type TX = string;

export type DEFAULT_BLOCK = ('earliest' | 'latest' | 'pending') & string;

export type JSONRPC2 = '2.0';

export interface JsonRpcResponse {
  id: string;
  result: string;
  error?: {
    code: string;
    message: string;
    data?: any;
  };
}

export interface RPCRequestBase {
  method: string;
  params?: any[];
}

export interface SendRawTxRequest extends RPCRequestBase {
  method: 'eth_sendRawTransaction';
  params: TX[];
}

export interface GetBalanceRequest extends RPCRequestBase {
  method: 'eth_getBalance';
  params: [string, DEFAULT_BLOCK];
}

export interface GetTokenBalanceRequest extends RPCRequestBase {
  method: 'eth_call';
  params: [
    {
      to: string;
      data: string;
    },
    DEFAULT_BLOCK
  ];
}

export interface CallRequest extends RPCRequestBase {
  method: 'eth_call';
  params: [
    {
      from?: string;
      to: string;
      gas?: string;
      gasPrice?: string;
      value?: string;
      data?: string;
    },
    DEFAULT_BLOCK
  ];
}

export interface EstimateGasRequest extends RPCRequestBase {
  method: 'eth_estimateGas';
  params: [Partial<ITxObject>];
}

export interface GetTransactionCountRequest extends RPCRequestBase {
  method: 'eth_getTransactionCount';
  params: [string, DEFAULT_BLOCK];
}

export interface GetTransactionByHashRequest extends RPCRequestBase {
  method: 'eth_getTransactionByHash';
  params: [string];
}

export interface GetTransactionReceiptRequest extends RPCRequestBase {
  method: 'eth_getTransactionReceipt';
  params: [string];
}

export interface GetCurrentBlockRequest extends RPCRequestBase {
  method: 'eth_blockNumber';
}

export type RPCRequest =
  | GetBalanceRequest
  | GetTokenBalanceRequest
  | CallRequest
  | EstimateGasRequest
  | GetTransactionCountRequest
  | GetTransactionByHashRequest
  | GetTransactionReceiptRequest
  | RPCRequestBase //base added so I can add an empty params array in decorateRequest without TS complaining
  | GetCurrentBlockRequest;
