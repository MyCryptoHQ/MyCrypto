import { ETHERSCAN_API_INVALID_KEY_MESSAGE } from './constants';

interface EtherScanApiResponse<T> {
  status: ('1' | '0') & string;
  message: ('OK' | ETHERSCAN_API_INVALID_KEY_MESSAGE | 'NOTOK') & string;
  result: T;
}

export type GetBalanceResponse = EtherScanApiResponse<string>;

interface GetTxResponseResultItem {
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
}

interface GetTokenTxResponseResultItem extends GetTxResponseResultItem {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
}

export type GetTxResponse = EtherScanApiResponse<GetTxResponseResultItem[]>;

export type GetTokenTxResponse = EtherScanApiResponse<GetTokenTxResponseResultItem[]>;
