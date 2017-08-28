// @flow
import Big from 'bignumber.js';
import BaseNode from '../base';
import type { TransactionWithoutGas } from 'libs/transaction';
import RPCClient, {
  getBalance,
  estimateGas,
  getTransactionCount,
  getTokenBalance,
  sendRawTx
} from './client';
import type { Token } from 'config/data';

export default class RpcNode extends BaseNode {
  client: RPCClient;
  constructor(endpoint: string) {
    super();
    this.client = new RPCClient(endpoint);
  }

  async getBalance(address: string): Promise<Big> {
    return this.client.call(getBalance(address)).then(response => {
      if (response.error) {
        throw new Error('getBalance error');
      }
      return new Big(String(response.result));
    });
  }

  async estimateGas(transaction: TransactionWithoutGas): Promise<Big> {
    return this.client.call(estimateGas(transaction)).then(response => {
      if (response.error) {
        throw new Error('estimateGas error');
      }
      return new Big(String(response.result));
    });
  }

  async getTokenBalance(address: string, token: Token): Promise<Big> {
    return this.client.call(getTokenBalance(address, token)).then(response => {
      if (response.error) {
        return Big(0);
      }
      return new Big(String(response.result)).div(
        new Big(10).pow(token.decimal)
      );
    });
  }

  async getTokenBalances(address: string, tokens: Token[]): Promise<Big[]> {
    return this.client
      .batch(tokens.map(t => getTokenBalance(address, t)))
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
  }

  async getTransactionCount(address: string): Promise<string> {
    return this.client.call(getTransactionCount(address)).then(response => {
      if (response.error) {
        throw new Error('getTransactionCount error');
      }
      return response.result;
    });
  }

  async sendRawTx(rawTx): Promise<string> {
    return this.client.call(sendRawTx(rawTx)).then(response => {
      if (response.error) {
        throw new Error('sendRawTx error');
      }
      return response.result;
    });
  }
}
