// @flow
import { randomBytes } from 'crypto';
import ERC20 from 'libs/erc20';
import { hexEncodeData } from './utils';
import type {
  RPCRequest,
  JsonRpcResponse,
  CallRequest,
  GetBalanceRequest,
  GetTokenBalanceRequest,
  EstimateGasRequest,
  GetTransactionCountRequest
} from './types';
import type { Token } from 'config/data';

// FIXME is it safe to generate that much entropy?
function id(): string {
  return randomBytes(16).toString('hex');
}

export function estimateGas<T: *>(transaction: T): EstimateGasRequest {
  return {
    id: id(),
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [transaction]
  };
}

export function getBalance(address: string): GetBalanceRequest {
  return {
    id: id(),
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [hexEncodeData(address), 'pending']
  };
}

export function ethCall<T: *>(transaction: T): CallRequest {
  return {
    id: id(),
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [transaction, 'pending']
  };
}

export function getTransactionCount(
  address: string
): GetTransactionCountRequest {
  return {
    id: id(),
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [address, 'pending']
  };
}

export function getTokenBalance(
  address: string,
  token: Token
): GetTokenBalanceRequest {
  return {
    id: id(),
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [
      {
        to: token.address,
        data: ERC20.balanceOf(address)
      },
      'pending'
    ]
  };
}

export default class RPCClient {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async call(request: RPCRequest): Promise<JsonRpcResponse> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }).then(r => r.json());
  }

  async batch(requests: RPCRequest[]): Promise<JsonRpcResponse[]> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requests)
    }).then(r => r.json());
  }
}
