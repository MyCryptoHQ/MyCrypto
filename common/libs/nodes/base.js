// @flow
import Big from 'big.js';
import type { TransactionWithoutGas } from 'libs/transaction';

export default class BaseNode {
  async getBalance(_address: string): Promise<Big> {
    throw new Error('Implement me');
  }

  async estimateGas(_tx: TransactionWithoutGas): Promise<Big> {
    throw new Error('Implement me');
  }
}
