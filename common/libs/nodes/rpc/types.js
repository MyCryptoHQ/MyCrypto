// @flow

type DATA = string;
type QUANTITY = string;

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

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

type RPCRequestBase = {
  id: string,
  jsonrpc: '2.0'
};

export type GetBalanceRequest = RPCRequestBase & {
  method: 'eth_getBalance',
  params: [DATA, DEFAULT_BLOCK]
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
  params: [
    {
      from?: DATA,
      to?: DATA,
      gas?: QUANTITY,
      gasPrice?: QUANTITY,
      value?: QUANTITY,
      data?: DATA
    }
  ]
};

export type GetTransactionCountRequest = RPCRequestBase & {
  method: 'eth_getTransactionCount',
  params: [DATA, DEFAULT_BLOCK]
};

export type RPCRequest =
  | GetBalanceRequest
  | CallRequest
  | EstimateGasRequest
  | GetTransactionCountRequest;
