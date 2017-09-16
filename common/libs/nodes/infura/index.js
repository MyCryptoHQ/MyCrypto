import RPCNode from '../rpc';
import InfuraClient from './client';

export default class InfuraNode extends RPCNode {
  client: InfuraClient;

  constructor(endpoint: string) {
    super(endpoint);
    this.client = new InfuraClient(endpoint);
  }
}
