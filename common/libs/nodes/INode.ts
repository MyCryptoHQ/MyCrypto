import { Wei, TokenValue } from 'libs/units';
import { IHexStrTransaction } from 'libs/transaction';
import { Token } from 'types/network';

export interface TxObj {
  to: string;
  data: string;
}

interface TokenBalanceResult {
  balance: TokenValue;
  error: string | null;
}

export interface TransactionData {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: string;
  to: string;
  value: Wei;
  gasPrice: Wei;
  gas: Wei;
  input: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: Wei;
  gasUsed: Wei;
  contractAddress: string | null;
  logs: string[];
  logsBloom: string;
  status: number;
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
