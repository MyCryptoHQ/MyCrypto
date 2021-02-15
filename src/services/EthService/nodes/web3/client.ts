import { randomBytes } from 'crypto';

import { JsonRPCResponse, Web3RequestPermissionsResponse } from '@types';

import { RPCRequest } from '../rpc';
import { IWeb3Provider } from './types';

export default class Web3Client {
  private provider: IWeb3Provider;

  constructor() {
    this.provider =
      (window as CustomWindow).ethereum || (window as CustomWindow).web3.currentProvider;
  }

  public id(): string | number {
    return randomBytes(16).toString('hex');
  }

  public decorateRequest = (req: RPCRequest) => ({
    ...req,
    id: this.id(),
    jsonrpc: '2.0',
    params: req.params || [] // default to empty array so MetaMask doesn't error
  });

  public call = (request: RPCRequest | any): Promise<JsonRPCResponse> =>
    this.sendAsync(this.decorateRequest(request)) as Promise<JsonRPCResponse>;

  public callWeb3 = (request: RPCRequest | any): Promise<Web3RequestPermissionsResponse> =>
    (this.sendAsync(this.decorateRequest(request)) as unknown) as Promise<
      Web3RequestPermissionsResponse
    >;

  public request = (request: RPCRequest | any): Promise<JsonRPCResponse> => this.request(request);

  public batch = (requests: RPCRequest[] | any): Promise<JsonRPCResponse[]> =>
    this.sendAsync(requests.map(this.decorateRequest)) as Promise<JsonRPCResponse[]>;

  private sendAsync = (request: any): Promise<JsonRPCResponse | JsonRPCResponse[]> => {
    return new Promise((resolve, reject) => {
      this.provider.sendAsync(request, (error, result: JsonRPCResponse | JsonRPCResponse[]) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  };
}
