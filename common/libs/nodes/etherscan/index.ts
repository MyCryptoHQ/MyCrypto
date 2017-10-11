import RPCNode from '../rpc';
import EtherscanClient from './client';
import EtherscanRequests from './requests';

export default class EtherscanNode extends RPCNode {
  public client: EtherscanClient;
  public requests: EtherscanRequests;

  constructor(endpoint: string) {
    super(endpoint);
    this.client = new EtherscanClient(endpoint);
    this.requests = new EtherscanRequests();
  }
}
