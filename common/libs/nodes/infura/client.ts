import Big from 'bignumber.js';
import { randomBytes } from 'crypto';
import RPCClient from '../rpc/client';

export default class InfuraClient extends RPCClient {
  public id(): string {
    return new Big('0x' + randomBytes(5).toString('hex')).toNumber();
  }
}
