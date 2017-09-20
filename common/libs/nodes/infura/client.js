import RPCClient from '../rpc/client';
import Big from 'bignumber.js';
import { randomBytes } from 'crypto';

export default class InfuraClient extends RPCClient {
  id(): string {
    return new Big('0x' + randomBytes(5).toString('hex')).toNumber();
  }
}
