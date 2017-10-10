import { RawTransaction } from 'libs/transaction';
interface SendReturn {
  signedTx: string;
  rawTx: RawTransaction;
}
export interface ABIFunc<T, K = void> {
  send(x: T): Promise<SendReturn>;
  call(x: T): Promise<K>;
  encodeOutput(x: T): string;
  decodeOutput(argStr: string): K;
}
export interface ABIFuncParamless<T = void> {
  send(): Promise<SendReturn>;
  call(): Promise<T>;
  encodeOutput(): string;
  decodeOutput(argStr: string): T;
}
