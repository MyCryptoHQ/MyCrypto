import { JsonRpcResponse, RPCRequest } from '../rpc/types';
import { IWeb3Provider } from './types';
import RPCClient from '../rpc/client';

export default class Web3Client extends RPCClient {
  private provider: IWeb3Provider;

  constructor() {
    super('web3'); // initialized with fake endpoint
    this.provider = (window as any).web3.currentProvider;
  }

  public decorateRequest = (req: RPCRequest) => ({
    ...req,
    id: this.id(),
    jsonrpc: '2.0',
    params: req.params || [] // default to empty array so MetaMask doesn't error
  });

  public call = (request: RPCRequest | any): Promise<JsonRpcResponse> =>
    this.sendAsync(this.decorateRequest(request)) as Promise<JsonRpcResponse>;

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
