// Enclave enums
export enum EnclaveEvents {
  GET_ADDRESSES = 'get-addresses',
  GET_CHAIN_CODE = 'get-chain-code',
  SIGN_TRANSACTION = 'sign-transaction'
}

export enum WalletTypes {
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  KEEPKEY = 'keepkey'
}

// Get Addresses Request
export interface GetAddressesParams {
  walletType: WalletTypes;
}

export interface GetAddressesResponse {
  addresses: string[];
}

// Get chain code request
export interface GetChainCodeParams {
  walletType: WalletTypes;
  dpath: string;
}

export interface GetChainCodeResponse {
  publicKey: string;
  chainCode: string;
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
export type EventParams = GetAddressesParams | GetChainCodeParams | SignTransactionParams;
export type EventResponse = GetAddressesResponse | GetChainCodeResponse | SignTransactionResponse;

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

// Wallet lib
export interface WalletLib {
  getChainCode(dpath: string): Promise<GetChainCodeResponse>;
}
