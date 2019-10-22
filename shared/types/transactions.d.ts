import { Wei } from 'libs/units';

export interface SavedTransaction {
  hash: string;
  to: string;
  from: string;
  nonce: number;
  value: string;
  chainId: number;
  time: number;
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

export interface TransactionState {
  data: TransactionData | null;
  receipt: TransactionReceipt | null;
  error: string | null;
  isLoading: boolean;
}
