import RPCNode from '../rpc';
import RPCClient from '../rpc/client';
import { CustomNodeConfig } from 'config/data';

export default class CustomNode extends RPCNode {
  constructor(config: CustomNodeConfig) {
    const endpoint = `${config.url}:${config.port}`;
    super(endpoint);

    const headers: { [key: string]: string } = {};
    if (config.auth) {
      const { username, password } = config.auth;
      headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    }

    this.client = new RPCClient(endpoint, headers);
  }
}
