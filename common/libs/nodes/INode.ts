import { Wei, TokenValue } from 'libs/units';
import { IHexStrTransaction } from 'libs/transaction';
import { Token } from 'types/network';

export interface TxObj {
  to: string;
  data: string;
}
export interface TokenBalanceResult {
  balance: TokenValue;
  error: string | null;
}
export interface INode {
  ping(): Promise<boolean>;
  getBalance(address: string): Promise<Wei>;
  getTokenBalance(address: string, token: Token): Promise<TokenBalanceResult>;
  getTokenBalances(address: string, tokens: Token[]): Promise<TokenBalanceResult[]>;
  estimateGas(tx: Partial<IHexStrTransaction>): Promise<Wei>;
  getTransactionCount(address: string): Promise<string>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: TxObj): Promise<string>;
  getCurrentBlock(): Promise<string>;
}
