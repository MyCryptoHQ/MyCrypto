import RPCNode from '../rpc';
import EtherscanClient from './client';
import EtherscanRequests from './requests';

export default class EtherscanNode extends RPCNode {
  client: EtherscanClient;
  requests: EtherscanRequests;

  constructor(endpoint: string) {
    super(endpoint);
    this.client = new EtherscanClient(endpoint);
    this.requests = new EtherscanRequests();
  }
}
