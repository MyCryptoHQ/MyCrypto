// Enclave enums
export enum EnclaveMethods {
  GET_ADDRESSES = 'get-addresses',
  GET_CHAIN_CODE = 'get-chain-code',
  SIGN_TRANSACTION = 'sign-transaction'
}

export enum WalletTypes {
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  KEEPKEY = 'keepkey'
}

export interface RawTransaction {
  chainId: number;
  gasLimit: string;
  gasPrice: string;
  to: string;
  nonce: string;
  data: string;
  value: string;
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
  walletType: WalletTypes;
  transaction: RawTransaction;
  path: string;
}

export interface SignTransactionResponse {
  signedTransaction: string;
}

// All Requests & Responses
export type EnclaveMethodParams = GetAddressesParams | GetChainCodeParams | SignTransactionParams;
export type EnclaveMethodResponse =
  | GetAddressesResponse
  | GetChainCodeResponse
  | SignTransactionResponse;

// RPC requests, responses & failures
export interface EnclaveSuccessResponse<T = EnclaveMethodResponse> {
  data: T;
  error?: undefined;
}

export interface EnclaveErrorResponse {
  data?: undefined;
  error: {
    code: number;
    type: string;
    message: string;
  };
}

export type EnclaveResponse<T = EnclaveMethodResponse> =
  | EnclaveSuccessResponse<T>
  | EnclaveErrorResponse;

// Wallet lib
export interface WalletLib {
  getChainCode(dpath: string): Promise<GetChainCodeResponse>;
  signTransaction(transaction: RawTransaction, path: string): Promise<SignTransactionResponse>;
}
