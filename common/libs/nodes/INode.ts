import Big from 'bignumber.js';
import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei } from 'libs/units';

export interface INode {
  getBalance(address: string): Promise<Wei>;
  getTokenBalance(address: string, token: Token): Promise<Big>;
  getTokenBalances(address: string, tokens: Token[]): Promise<Big>;
  estimateGas(tx: TransactionWithoutGas): Promise<Big>;
  getTransactionCount(address: string): Promise<string>;
  sendRawTx(tx: string): Promise<string>;
}
