import { ETHERSCAN_API_INVALID_KEY_MESSAGE, ETHERSCAN_API_MAX_LIMIT_REACHED } from './constants';

interface EtherScanApiBaseResponse {
  status: ('1' | '0') & string;
  message: ('OK' | ETHERSCAN_API_INVALID_KEY_MESSAGE | 'NOTOK') & string;
  result: any | ETHERSCAN_API_MAX_LIMIT_REACHED;
}

export interface GetBalanceResponse extends EtherScanApiBaseResponse {
  result: string;
}

interface GetLastTxResponseResultItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
}

export interface GetLastTxResponse extends EtherScanApiBaseResponse {
  result: GetLastTxResponseResultItem[];
}
