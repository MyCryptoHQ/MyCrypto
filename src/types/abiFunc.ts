export interface ABIFunc<T, K = void> {
  outputType: K;
  decodeInput(argStr: string): T;
  encodeInput(x: T): string;
  decodeOutput(argStr: string): K;
}

export interface ABIFuncParamless<T = void> {
  outputType: T;
  encodeInput(): string;
  decodeOutput(argStr: string): T;
}
