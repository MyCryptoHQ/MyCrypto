import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei, TokenValue } from 'libs/units';

export interface TxObj {
  to: string;
  data: string;
}
export interface INode {
  getBalance(address: string): Promise<Wei>;
  getTokenBalance(address: string, token: Token): Promise<TokenValue | string>;
  getTokenBalances(
    address: string,
    tokens: Token[]
  ): Promise<(TokenValue | string)[]>;
  estimateGas(tx: TransactionWithoutGas): Promise<Wei>;
  getTransactionCount(address: string): Promise<string>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: TxObj): Promise<string>;
  getCurrentBlock(): Promise<string>;
}
