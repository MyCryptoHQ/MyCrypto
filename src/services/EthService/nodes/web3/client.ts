import { Web3RequestPermissionsResponse } from '@types';

import { JsonRpcResponse, RPCClient, RPCRequest } from '../rpc';
import { IWeb3Provider } from './types';

export default class Web3Client extends RPCClient {
  private provider: IWeb3Provider;

  constructor() {
    super('web3'); // initialized with fake endpoint
    console.debug('[Web3Client]: Trying to initialize Web3Client');
    this.provider = (window as any).ethereum || (window as any).web3.currentProvider;
    console.debug(
      `[Web3Client]: instantiated this.provider: ${this.provider} == ${
        (window as any).ethereum || (window as any).web3.currentProvider
      }`
    );
  }

  // @ts-expect-error: conflict between Web3Client and RPCClient method signatures
  public decorateRequest = (req: RPCRequest) => ({
    ...req,
    id: this.id(),
    jsonrpc: '2.0',
    params: req.params || [] // default to empty array so MetaMask doesn't error
  });

  public call = (request: RPCRequest | any): Promise<JsonRpcResponse> =>
    this.sendAsync(this.decorateRequest(request)) as Promise<JsonRpcResponse>;

  public callWeb3 = (request: RPCRequest | any): Promise<Web3RequestPermissionsResponse> =>
    (this.sendAsync(this.decorateRequest(request)) as unknown) as Promise<
      Web3RequestPermissionsResponse
    >;

  public request = (request: RPCRequest | any): Promise<JsonRpcResponse> => this.request(request);

  public batch = (requests: RPCRequest[] | any): Promise<JsonRpcResponse[]> =>
    this.sendAsync(requests.map(this.decorateRequest)) as Promise<JsonRpcResponse[]>;

  private sendAsync = (request: any): Promise<JsonRpcResponse | JsonRpcResponse[]> => {
    return new Promise((resolve, reject) => {
      this.provider.sendAsync(request, (error, result: JsonRpcResponse | JsonRpcResponse[]) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  };
}
