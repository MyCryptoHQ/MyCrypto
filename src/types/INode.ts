import { TransactionReceipt, TransactionResponse } from 'ethers/providers';

import { Asset, IHexStrTransaction } from '@types';
import { TokenValue, Wei } from '@utils';

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
  getTokenBalance(address: string, token: Asset): Promise<TokenBalanceResult>;
  getTokenBalances(address: string, tokens: Asset[]): Promise<TokenBalanceResult[]>;
  estimateGas(tx: Partial<IHexStrTransaction>): Promise<Wei>;
  getTransactionCount(address: string): Promise<string>;
  getTransactionByHash(txhash: string): Promise<TransactionResponse>;
  getTransactionReceipt(txhash: string): Promise<TransactionReceipt>;
  sendRawTx(tx: string): Promise<string>;
  sendCallRequest(txObj: TxObj): Promise<string>;
  getCurrentBlock(): Promise<string>;
}
