import { BigNumber } from 'bignumber.js';
import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei } from 'libs/units';

export interface INode {
  getBalance(address: string): Promise<Wei>;
  getTokenBalance(address: string, token: Token): Promise<BigNumber>;
  getTokenBalances(address: string, tokens: Token[]): Promise<BigNumber[]>;
  estimateGas(tx: TransactionWithoutGas): Promise<BigNumber>;
  getTransactionCount(address: string): Promise<string>;
  sendRawTx(tx: string): Promise<string>;
}
