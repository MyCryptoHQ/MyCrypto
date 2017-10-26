import BN from 'bn.js';
import { Token } from 'config/data';

export type TUnit = typeof Units;
export type UnitKey = keyof TUnit;

export type Wei = BN;
export const Wei = (input: number | string | BN, base: number = 10): Wei =>
  new BN(input, base);

export interface TokenValue {
  value: BN;
  decimal: number;
}

export const TokenValue = (
  input: number | string | BN,
  decimal: number,
  base: number = 10
): TokenValue => ({ value: new BN(input, base), decimal });

function toTokenUnit(num: BN, token: Token): BN {
  return num.mul(new BN(10).pow(new BN(token.decimal)));
}

function toTokenDisplay(num: BN, token: Token): BN {
  return num.mul(new BN(10).pow(new BN(-token.decimal)));
}
