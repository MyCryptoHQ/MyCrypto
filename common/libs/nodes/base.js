// @flow
import Big from 'bignumber.js';
import type {
  TransactionWithoutGas,
  Transaction,
  BroadcastTransaction
} from 'libs/transaction';
import type { Token } from 'config/data';
import type { BaseWallet } from 'libs/wallet';

export default class BaseNode {
  async getBalance(_address: string): Promise<Big> {
    throw new Error('Implement me');
  }

  async getTokenBalances(_address: string, _tokens: Token[]): Promise<Big[]> {
    throw new Error('Implement me');
  }

  async estimateGas(_tx: TransactionWithoutGas): Promise<Big> {
    throw new Error('Implement me');
  }

  async generateTransaction(
    _tx: Transaction,
    _wallet: BaseWallet
  ): Promise<BroadcastTransaction> {
    throw new Error('Implement me');
  }
}
