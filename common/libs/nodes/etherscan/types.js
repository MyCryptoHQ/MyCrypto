export type EtherscanReqBase = {
  module: string,
  action: string
};

export type SendRawTxRequest = EtherscanReqBase & {
  module: 'proxy',
  method: 'eth_sendRawTransaction',
  hex: string
};

export type GetBalanceRequest = EtherscanReqBase & {
  module: 'account',
  action: 'balance',
  address: string,
  tag: 'latest'
};

export type CallRequest = EtherscanReqBase & {
  module: 'proxy',
  action: 'eth_call',
  to: string,
  data: string
};

export type GetTokenBalanceRequest = CallRequest;

export type EstimateGasRequest = EtherscanReqBase & {
  module: 'proxy',
  method: 'eth_estimateGas',
  to: string,
  value: string | number,
  data: string,
  from: string
};

export type GetTransactionCountRequest = EtherscanReqBase & {
  module: 'proxy',
  action: 'eth_getTransactionCount',
  address: string,
  tag: 'latest'
};
