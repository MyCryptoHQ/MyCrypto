import { Token } from 'config/data';
import { Wei, TokenValue } from 'libs/units';
import { ITransaction } from 'libs/transaction';

export interface TxObj {
  to: string;
  data: string;
}
export interface INode {
  getBalance(address: string): Promise<Wei>;
  getTokenBalance(address: string, token: Token): Promise<TokenValue>;
  getTokenBalances(address: string, tokens: Token[]): Promise<TokenValue[]>;
  estimateGas(tx: ITransaction): Promise<Wei>;
  getTransactionCount(address: string): Promise<string>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: TxObj): Promise<string>;
}
