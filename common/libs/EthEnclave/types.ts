export enum EnclaveEvents {
  SIGN_RAW_TRANSACTION = 'sign-raw-transaction'
}

export interface RpcEventFailure {
  payload: null;
  errMsg: string;
  id: number;
}

export interface RpcEventSuccess<T = any> {
  payload: T;
  errMsg: null;
  id: number;
}

export type RpcEvent<T = any> = RpcEventFailure | RpcEventSuccess<T>;

export interface RpcEventServer<T = any> {
  payload: T;
  id: number;
}

export type RpcEventHandler<A = any, R = any> = (event: EnclaveEvents, args: A) => R;

export type MatchingIdHandler<A = any> = (event: string, args: A) => void;

export interface SignRawTransactionParams {
  path: string;
  rawTxHex: string;
}

export interface SignRawTransaction {
  s: string;
  v: string;
  r: string;
}

export interface EnclaveProvider {
  signRawTransaction(params: SignRawTransactionParams): Promise<SignRawTransaction>;
}

export type ElectronInjectedGlobals = Window & EnclaveProvider;
