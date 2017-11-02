import { RawTransaction } from 'libs/transaction';
import { IUserSendParams } from 'libs/contracts/ABIFunction';
import BN from 'bn.js';

interface SendReturn {
  signedTx: string;
  rawTx: RawTransaction;
}

interface ISend<T> extends IUserSendParams {
  input: T;
}

interface ISendParamless {
  to?: string;
  gasLimit: BN;
  value: string;
}

export interface ABIFunc<T, K = void> {
  send(x: ISend<T>): Promise<SendReturn>;
  call(x: T): Promise<K>;
  encodeOutput(x: T): string;
  decodeOutput(argStr: string): K;
}

export interface ABIFuncParamless<T = void> {
  send(x: ISendParamless): Promise<SendReturn>;
  call(): Promise<T>;
  encodeOutput(): string;
  decodeOutput(argStr: string): T;
}
