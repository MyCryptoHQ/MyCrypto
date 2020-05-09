import { Wei, TokenValue } from '@services/EthService';
import { IHexStrTransaction } from '@types';
import { Token } from 'types/network';
import { TransactionData, TransactionReceipt } from 'types/transactions';

export interface TxObj {
  to: string;
  data: string;
}

interface TokenBalanceResult {
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
  getTransactionByHash(txhash: string): Promise<TransactionData>;
  getTransactionReceipt(txhash: string): Promise<TransactionReceipt>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: TxObj): Promise<string>;
  getCurrentBlock(): Promise<string>;
}
