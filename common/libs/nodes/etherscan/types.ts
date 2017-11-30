export interface EtherscanReqBase {
  module: string;
  action?: string;
}

export interface SendRawTxRequest extends EtherscanReqBase {
  module: 'proxy';
  action: 'eth_sendRawTransaction';
  hex: string;
}

export interface GetBalanceRequest extends EtherscanReqBase {
  module: 'account';
  action: 'balance';
  address: string;
  tag: 'latest';
}

export interface CallRequest extends EtherscanReqBase {
  module: 'proxy';
  action: 'eth_call';
  to: string;
  data: string;
}

export type GetTokenBalanceRequest = CallRequest;

export interface EstimateGasRequest extends EtherscanReqBase {
  module: 'proxy';
  action: 'eth_estimateGas';
  to: string;
  value: string | number;
  data: string;
  from: string;
}

export interface GetTransactionCountRequest extends EtherscanReqBase {
  module: 'proxy';
  action: 'eth_getTransactionCount';
  address: string;
  tag: 'latest';
}

export interface GetCurrentBlockRequest extends EtherscanReqBase {
  module: 'proxy';
  action: 'eth_blockNumber';
}

export type EtherscanRequest =
  | SendRawTxRequest
  | GetBalanceRequest
  | CallRequest
  | GetTokenBalanceRequest
  | EstimateGasRequest
  | GetTransactionCountRequest
  | GetCurrentBlockRequest;
