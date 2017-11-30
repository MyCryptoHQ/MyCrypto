import { randomBytes } from 'crypto';
import { JsonRpcResponse, RPCRequest } from './types';

export default class RPCClient {
  public endpoint: string;
  public headers: { [key: string]: string };
  constructor(endpoint: string, headers: { [key: string]: string } = {}) {
    this.endpoint = endpoint;
    this.headers = headers;
  }

  public id(): string | number {
    return randomBytes(16).toString('hex');
  }

  public decorateRequest = (req: RPCRequest) => ({
    ...req,
    id: this.id(),
    jsonrpc: '2.0'
  });

  public call = (request: RPCRequest | any): Promise<JsonRpcResponse> => {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: this.createHeaders({
        'Content-Type': 'application/json',
        ...this.headers
      }),
      body: JSON.stringify(this.decorateRequest(request))
    }).then(r => r.json());
  };

  public batch = (requests: RPCRequest[] | any): Promise<JsonRpcResponse[]> => {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: this.createHeaders({
        'Content-Type': 'application/json',
        ...this.headers
      }),
      body: JSON.stringify(requests.map(this.decorateRequest))
    }).then(r => r.json());
  };

  private createHeaders = headerObject => {
    const headers = new Headers();
    Object.keys(headerObject).forEach(name => {
      headers.append(name, headerObject[name]);
    });
    return headers;
  };
}
