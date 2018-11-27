export interface Cache {
  [entry: string]: {
    value: any;
    ttl: number;
  };
}

export interface NewCacheEntry {
  [key: string]: any;
}

export type DepositStatus = 'error' | 'complete' | 'no_deposits';

export interface DepositStatusResponse {
  status: DepositStatus;
  address: string;
}

export interface DepositStatusIncompleteResponse extends DepositStatusResponse {
  error: string;
}

export interface DepositStatusCompleteResponse extends DepositStatusResponse {
  withdraw: string;
  incomingCoin: number;
  incomingType: string;
  outcoingCoin: number;
  outgoingType: string;
  transaction: string;
}

export type DepositStatusNoneResponse = DepositStatusResponse;

export interface MarketPair {
  limit: number;
  maxLimit: number;
  min: number;
  minerFee: number;
  pair: string;
  rate: number;
}

export interface MarketPairHash {
  [pair: string]: MarketPair;
}

export interface RatesResponse {
  pair: string;
  limit: string;
  min: string;
}

export interface SendAmountRequest {
  amount: string;
  withdrawal: string;
  pair: string;
}

export interface SendAmountResponse {
  apiPubKey: string;
  deposit: string;
  depositAmount: string;
  expiration: number;
  maxLimit: number;
  minerFee: string;
  orderId: string;
  pair: string;
  quotedRate: string;
  returnAddress: string;
  userId: string;
  withdrawal: string;
  withdrawalAmount: string;
}

export interface TimeRemainingResponse {
  status: string;
  seconds_remaining: string;
}
