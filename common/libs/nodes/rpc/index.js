// @flow
import Big from 'bignumber.js';
import type { INode } from '../INode';
import type { TransactionWithoutGas } from 'libs/messages';
import RPCClient from './client';
import RPCRequests from './requests';
import { Wei } from 'libs/units';
import type { Token } from 'config/data';

export default class RpcNode implements INode {
  client: RPCClient;
  requests: RPCRequests;
  constructor(endpoint: string) {
    this.client = new RPCClient(endpoint);
    this.requests = new RPCRequests();
  }

  getBalance(address: string): Promise<Wei> {
    return this.client
      .call(this.requests.getBalance(address))
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return new Wei(String(response.result));
      });
  }

  estimateGas(transaction: TransactionWithoutGas): Promise<Big> {
    return this.client
      .call(this.requests.estimateGas(transaction))
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return new Big(String(response.result));
      });
  }

  getTokenBalance(address: string, token: Token): Promise<Big> {
    return this.client
      .call(this.requests.getTokenBalance(address, token))
      .then(response => {
        if (response.error) {
          // TODO - Error handling
          return new Big(0);
        }
        return new Big(String(response.result)).div(
          new Big(10).pow(token.decimal)
        );
      });
  }

  getTokenBalances(address: string, tokens: Token[]): Promise<Big[]> {
    return this.client
      .batch(tokens.map(t => this.requests.getTokenBalance(address, t)))
      .then(response => {
        return response.map((item, idx) => {
          // FIXME wrap in maybe-like
          if (item.error) {
            return new Big(0);
          }
          return new Big(String(item.result)).div(
            new Big(10).pow(tokens[idx].decimal)
          );
        });
      });
    // TODO - Error handling
  }

  getTransactionCount(address: string): Promise<string> {
    return this.client
      .call(this.requests.getTransactionCount(address))
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.result;
      });
  }

  sendRawTx(signedTx: string): Promise<string> {
    return this.client
      .call(this.requests.sendRawTx(signedTx))
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        if (response.errorMessage) {
          throw new Error(response.errorMessage);
        }
        return response.result;
      });
  }
}
