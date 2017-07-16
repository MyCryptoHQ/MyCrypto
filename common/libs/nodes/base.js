// @flow
import Big from 'big.js';

export default class BaseNode {
  async getBalance(_address: string): Promise<Big> {
    throw new Error('Implement me');
  }
}
