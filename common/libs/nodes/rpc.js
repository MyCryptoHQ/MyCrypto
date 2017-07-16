// @flow
import BaseNode from './base';
import { randomBytes } from 'crypto';
import Big from 'big.js';

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

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

// FIXME
type EthCall = any;

export default class RPCNode extends BaseNode {
  endpoint: string;
  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  async getBalance(address: string): Promise<Big> {
    return this.post('eth_getBalance', [address, 'pending']).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      // FIXME is this safe?
      return new Big(Number(response.result));
    });
  }

  // FIXME extract batching
  async ethCall(calls: EthCall[]) {
    return this.batchPost(
      calls.map(params => {
        return {
          id: randomBytes(16).toString('hex'),
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [params, 'pending']
        };
      })
    );
  }

  async post(method: string, params: string[]): Promise<JsonRpcResponse> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: randomBytes(16).toString('hex'),
        jsonrpc: '2.0',
        method,
        params
      })
    }).then(r => r.json());
  }

  // FIXME
  async batchPost(requests: any[]): Promise<JsonRpcResponse[]> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requests)
    }).then(r => r.json());
  }
}
