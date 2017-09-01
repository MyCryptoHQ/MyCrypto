// @flow
import Big from 'bignumber.js';
import type { TransactionWithoutGas } from 'libs/transaction';
import type { Token } from 'config/data';

export default class BaseNode {
  async getBalance(_address: string): Promise<Big> {
    throw new Error('Implement me');
  }

  async getTokenBalance(_address: string, _token: Token): Promise<Big> {
    throw new Error('Implement me');
  }

  async getTokenBalances(_address: string, _tokens: Token[]): Promise<Big[]> {
    throw new Error('Implement me');
  }

  async estimateGas(_tx: TransactionWithoutGas): Promise<Big> {
    throw new Error('Implement me');
  }

  async getTransactionCount(_address: string): Promise<string> {
    throw new Error('Implement me');
  }

  async sendRawTx(_tx: string): Promise<string> {
    throw new Error('Implement me');
  }
}
