import BN from 'bn.js';
import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei } from 'libs/units';

export interface TxObj {
  to: string;
  data: string;
}
export interface INode {
  getBalance(address: string): Promise<Wei>;
  getTokenBalance(address: string, token: Token): Promise<BN>;
  getTokenBalances(address: string, tokens: Token[]): Promise<BN[]>;
  estimateGas(tx: TransactionWithoutGas): Promise<BN>;
  getTransactionCount(address: string): Promise<string>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: TxObj): Promise<string>;
}
