// don't use flow temporarily
import type { TransactionWithoutGas } from 'libs/messages';

type DATA = string;
type QUANTITY = string;
type TX = string;

export type DEFAULT_BLOCK = string | 'earliest' | 'latest' | 'pending';

type JsonRpcSuccess = {|
  id: string,
  result: string
|};

type JsonRpcError = {|
  error: {
    code: string,
    message: string,
    data?: any
  }
|};

export type JSONRPC2 = '2.0';

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

type RPCRequestBase = {
  method: string
};

export type SendRawTxRequest = RPCRequestBase & {
  method: 'eth_sendRawTransaction',
  params: [TX]
};

export type GetBalanceRequest = RPCRequestBase & {
  method: 'eth_getBalance',
  params: [DATA, DEFAULT_BLOCK]
};

export type GetTokenBalanceRequest = RPCRequestBase & {
  method: 'eth_call',
  params: [
    {
      to: string,
      data: string
    },
    DEFAULT_BLOCK
  ]
};

export type CallRequest = RPCRequestBase & {
  method: 'eth_call',
  params: [
    {
      from?: DATA,
      to: DATA,
      gas?: QUANTITY,
      gasPrice?: QUANTITY,
      value?: QUANTITY,
      data?: DATA
    },
    DEFAULT_BLOCK
  ]
};

export type EstimateGasRequest = RPCRequestBase & {
  method: 'eth_estimateGas',
  params: [TransactionWithoutGas]
};

export type GetTransactionCountRequest = RPCRequestBase & {
  method: 'eth_getTransactionCount',
  params: [DATA, DEFAULT_BLOCK]
};

export type RPCRequest =
  | GetBalanceRequest
  | GetTokenBalanceRequest
  | CallRequest
  | EstimateGasRequest
  | GetTransactionCountRequest;
