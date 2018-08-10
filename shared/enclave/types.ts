// Enclave enums
export enum EnclaveMethods {
  GET_CHAIN_CODE = 'get-chain-code',
  SIGN_TRANSACTION = 'sign-transaction',
  SIGN_MESSAGE = 'sign-message',
  DISPLAY_ADDRESS = 'display-address'
}

export enum WalletTypes {
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  SAFE_T = 'safe-t',
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

// Sign Message Request
export interface SignMessageParams {
  walletType: WalletTypes;
  message: string;
  path: string;
}

export interface SignMessageResponse {
  signedMessage: string;
}

// Display Address Request
export interface DisplayAddressParams {
  walletType: WalletTypes;
  path: string;
}

export interface DisplayAddressResponse {
  success: boolean;
}

// All Requests & Responses
export type EnclaveMethodParams =
  | GetChainCodeParams
  | SignTransactionParams
  | SignMessageParams
  | DisplayAddressParams;
export type EnclaveMethodResponse =
  | GetChainCodeResponse
  | SignTransactionResponse
  | SignMessageResponse
  | DisplayAddressResponse;

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
  signMessage(msg: string, path: string): Promise<SignMessageResponse>;
  displayAddress(path: string): Promise<DisplayAddressResponse>;
}
