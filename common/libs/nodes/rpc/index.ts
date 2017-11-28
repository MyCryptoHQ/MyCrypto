import BN from 'bn.js';
import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei, TokenValue } from 'libs/units';
import { stripHexPrefix } from 'libs/values';
import { INode, TxObj } from '../INode';
import RPCClient from './client';
import RPCRequests from './requests';

function errorOrResult(response) {
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.result;
}

export default class RpcNode implements INode {
  public client: RPCClient;
  public requests: RPCRequests;

  constructor(endpoint: string) {
    this.client = new RPCClient(endpoint);
    this.requests = new RPCRequests();
  }

  public sendCallRequest(txObj: TxObj): Promise<string> {
    return this.client.call(this.requests.ethCall(txObj)).then(r => {
      if (r.error) {
        throw Error(r.error.message);
      }
      return r.result;
    });
  }
  public getBalance(address: string): Promise<Wei> {
    return this.client
      .call(this.requests.getBalance(address))
      .then(errorOrResult)
      .then(result => Wei(result));
  }

  public estimateGas(transaction: TransactionWithoutGas): Promise<Wei> {
    return this.client
      .call(this.requests.estimateGas(transaction))
      .then(errorOrResult)
      .then(result => Wei(result));
  }

  public getTokenBalance(address: string, token: Token): Promise<TokenValue> {
    return this.client
      .call(this.requests.getTokenBalance(address, token))
      .then(response => {
        if (response.error) {
          // TODO - Error handling
          return TokenValue('0');
        }
        return TokenValue(response.result);
      });
  }

  public getTokenBalances(
    address: string,
    tokens: Token[]
  ): Promise<TokenValue[]> {
    return this.client
      .batch(tokens.map(t => this.requests.getTokenBalance(address, t)))
      .then(response => {
        return response.map(item => {
          // FIXME wrap in maybe-like
          if (item.error) {
            return TokenValue('0');
          }
          return TokenValue(item.result);
        });
      });
    // TODO - Error handling
  }

  public getTransactionCount(address: string): Promise<string> {
    return this.client
      .call(this.requests.getTransactionCount(address))
      .then(errorOrResult);
  }

  public getCurrentBlock(): Promise<string> {
    return this.client
      .call(this.requests.getCurrentBlock())
      .then(errorOrResult)
      .then(result => new BN(stripHexPrefix(result)).toString());
  }

  public sendRawTx(signedTx: string): Promise<string> {
    return this.client
      .call(this.requests.sendRawTx(signedTx))
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.result;
      });
  }
}
