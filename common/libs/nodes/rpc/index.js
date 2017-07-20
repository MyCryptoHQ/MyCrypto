// @flow
import Big from 'big.js';
import BaseNode from '../base';
import type { TransactionWithoutGas } from 'libs/transaction';
import RPCClient, { getBalance, estimateGas, ethCall } from './client';
import type { Token } from 'config/data';
import ERC20 from 'libs/erc20';

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
      return new Big(Number(response.result));
    });
  }

  async estimateGas(transaction: TransactionWithoutGas): Promise<Big> {
    return this.client.call(estimateGas(transaction)).then(response => {
      if (response.error) {
        throw new Error('estimateGas error');
      }
      // FIXME hexdec
      return new Big(Number(response.result));
    });
  }

  async getTokenBalances(address: string, tokens: Token[]): Promise<Big[]> {
    const data = ERC20.balanceOf(address);
    return this.client
      .batch(
        tokens.map(t =>
          ethCall({
            to: t.address,
            data
          })
        )
      )
      .then(response => {
        return response.map((item, idx) => {
          // FIXME wrap in maybe-like
          if (item.error) {
            return Big(0);
          }
          // FIXME hexdec
          return Big(Number(item.result)).div(Big(10).pow(tokens[idx].decimal));
        });
      });
  }
}
