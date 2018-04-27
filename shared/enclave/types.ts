// All enclave event types
export enum EnclaveEvents {
  GET_ADDRESSES = 'get-addresses',
  SIGN_TRANSACTION = 'sign-transaction'
}

// Get Addresses Request
export interface GetAddressesParams {
  walletType: string;
}

export interface GetAddressesResponse {
  addresses: string[];
}

// Sign Transaction Request
export interface SignTransactionParams {
  path: string;
  rawTxHex: string;
}

export interface SignTransactionResponse {
  s: string;
  v: string;
  r: string;
}

// All Requests & Responses
export type EventParams = GetAddressesParams | SignTransactionParams;
export type EventResponse = GetAddressesResponse | SignTransactionResponse;

// RPC requests, responses & failures
export interface RpcRequest {
  isRequest: true;
  params: EventParams;
  type: EnclaveEvents;
  id: number;
}

export interface RpcEventSuccess<T = any> {
  isResponse: true;
  payload: T;
  errMsg: undefined;
  id: number;
}

export interface RpcEventFailure {
  isResponse: true;
  errMsg: string;
  payload: undefined;
  id: number;
}

export type RpcEvent<T = any> = RpcEventFailure | RpcEventSuccess<T>;

// No clue
export interface RpcEventServer<T = any> {
  payload: T;
  id: number;
}
export type RpcEventHandler<A = any, R = any> = (event: EnclaveEvents, args: A) => R;
export type MatchingIdHandler<A = any> = (event: string, args: A) => void;
