// @flow
import { randomBytes } from 'crypto';
import type { RPCRequest, JsonRpcResponse } from './types';

export default class RPCClient {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  id(): string {
    return randomBytes(16).toString('hex');
  }

  decorateRequest(req: RPCRequest) {
    return {
      ...req,
      id: this.id(),
      jsonrpc: '2.0'
    };
  }

  async call(request: RPCRequest): Promise<JsonRpcResponse> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.decorateRequest(request))
    }).then(r => r.json());
  }

  async batch(requests: RPCRequest[]): Promise<JsonRpcResponse[]> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requests.map(this.decorateRequest))
    }).then(r => r.json());
  }
}
