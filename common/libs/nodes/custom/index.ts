import RPCNode from '../rpc';
import RPCClient from '../rpc/client';
import { CustomNodeConfig } from 'types/node';
import { Omit } from 'react-router';

export default class CustomNode extends RPCNode {
  constructor(config: Omit<CustomNodeConfig, 'lib'>) {
    super(config.id);

    const headers: { [key: string]: string } = {};
    if (config.auth) {
      const { username, password } = config.auth;
      headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    }

    this.client = new RPCClient(config.id, headers);
  }
}
