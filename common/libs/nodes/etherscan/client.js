// @flow
import RPCClient from '../rpc/client';
import type { EtherscanRequest } from './types';
import type { JsonRpcResponse } from '../rpc/types';

export default class EtherscanClient extends RPCClient {
  encodeRequest(request: EtherscanRequest): string {
    const encoded = new URLSearchParams();
    Object.keys(request).forEach(key => {
      encoded.set(key, request[key]);
    });
    return encoded.toString();
  }

  async call(request: EtherscanRequest): Promise<JsonRpcResponse> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: this.encodeRequest(request)
    }).then(r => r.json());
  }

  async batch(requests: EtherscanRequest[]): Promise<JsonRpcResponse[]> {
    const promises = requests.map(req => this.call(req));
    return Promise.all(promises);
  }
}
