export enum DepositStatuses {
  error = 'error',
  no_deposits = 'no_deposits',
  received = 'received',
  complete = 'complete',
  out_of_time = 'out_of_time'
}

export interface DepositStatusResponseBase {
  status: DepositStatuses;
  address: string;
}

export interface DepositStatusErrorResponse extends DepositStatusResponseBase {
  error: string;
}

export interface DepositStatusReceivedResponse extends DepositStatusResponseBase {
  userId: string;
  withdraw: string;
  incomingCoin: number;
  incomingType: string;
}

export interface DepositStatusCompleteResponse extends DepositStatusReceivedResponse {
  outcoingCoin: number;
  outgoingType: string;
  transaction: string;
  transactionURL: string;
}

export type DepositStatusNoneResponse = DepositStatusResponseBase;

export type DepositStatusResponse =
  | DepositStatusNoneResponse
  | DepositStatusErrorResponse
  | DepositStatusReceivedResponse
  | DepositStatusCompleteResponse;

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

  /** @desc
   * For XMR swaps,
   * the `deposit` property acts as the Payment ID,
   * while the `sAddress` property is the actual receiving address.
   */
  sAddress?: string;
}

export interface TimeRemainingResponse {
  status: string;
  seconds_remaining: string;
}

export interface ShapeShiftAssetWhitelistHash {
  [asset: string]: true;
}
