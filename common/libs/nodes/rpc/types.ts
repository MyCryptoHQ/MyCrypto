// don't use flow temporarily
import { TransactionWithoutGas } from 'libs/messages';

type DATA = string;
type QUANTITY = string;
type TX = string;

export type DEFAULT_BLOCK = string | 'earliest' | 'latest' | 'pending';

interface JsonRpcSuccess {
  id: string;
  result: string;
}

interface JsonRpcError {
  error: {
    code: string;
    message: string;
    data?: any;
  };
}

export type JSONRPC2 = '2.0';

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

interface RPCRequestBase {
  id: string;
  jsonrpc: JSONRPC2;
  method: string;
}

export interface SendRawTxRequest extends RPCRequestBase {
  method: 'eth_sendRawTransaction';
  params: [TX];
}

export interface GetBalanceRequest extends RPCRequestBase {
  method: 'eth_getBalance';
  params: [DATA, DEFAULT_BLOCK];
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
      from?: DATA;
      to: DATA;
      gas?: QUANTITY;
      gasPrice?: QUANTITY;
      value?: QUANTITY;
      data?: DATA;
    },
    DEFAULT_BLOCK
  ];
}

export interface EstimateGasRequest extends RPCRequestBase {
  method: 'eth_estimateGas';
  params: [TransactionWithoutGas];
}

export interface GetTransactionCountRequest extends RPCRequestBase {
  method: 'eth_getTransactionCount';
  params: [DATA, DEFAULT_BLOCK];
}

export type RPCRequest =
  | GetBalanceRequest
  | GetTokenBalanceRequest
  | CallRequest
  | EstimateGasRequest
  | GetTransactionCountRequest;
