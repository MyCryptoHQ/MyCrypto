import BN from 'bn.js';
import { stripHexPrefix } from 'libs/values';
export type TUnit = typeof Units;
export type UnitKey = keyof TUnit;
type Wei = BN;
type TokenValue = BN;

const Units = {
  wei: '1',
  kwei: '1000',
  ada: '1000',
  femtoether: '1000',
  mwei: '1000000',
  babbage: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  einstein: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000'
};
type TUnit = typeof Units;
type UnitKey = keyof TUnit;

export interface IValue {
  value: string;
  decimal: number;
}

const Wei = (input: string | BN, base: number = 10): Wei =>
  typeof input === 'string'
    ? new BN(stripHexPrefix(input), base)
    : new BN(input, base);

const TokenValue = (input: string | BN, base: number = 10) =>
  typeof input === 'string'
    ? new BN(stripHexPrefix(input), base)
    : new BN(input, base);

const getDecimal = (key: UnitKey) => Units[key].length - 1;

const stripRightZeros = (str: string) => {
  const strippedStr = str.replace(/0+$/, '');
  return strippedStr === '' ? null : strippedStr;
};

const baseToConvertedUnit = (value: string, decimal: number) => {
  if (decimal === 0) {
    return value;
  }
  const paddedValue = value.padStart(decimal + 1, '0'); //0.1 ==>
  const integerPart = paddedValue.slice(0, -decimal);
  const fractionPart = stripRightZeros(paddedValue.slice(-decimal));
  return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`;
};

const convertedToBaseUnit = (value: string, decimal: number) => {
  if (decimal === 0) {
    return value;
  }
  const [integerPart, fractionPart = ''] = value.split('.');
  const paddedFraction = fractionPart.padEnd(decimal, '0');
  return `${integerPart}${paddedFraction}`;
};

const fromWei = (wei: Wei, unit: UnitKey): IValue => {
  const decimal = getDecimal(unit);
  return { value: baseToConvertedUnit(wei.toString(), decimal), decimal };
};

const toWei = (ethereumUnit: IValue): Wei => {
  const wei = convertedToBaseUnit(ethereumUnit.value, ethereumUnit.decimal);
  return Wei(wei);
};

const fromTokenBase = ({ value, decimal }: IValue): IValue => ({
  value: baseToConvertedUnit(value, decimal),
  decimal
});

const toTokenBase = ({ value, decimal }: IValue) =>
  TokenValue(convertedToBaseUnit(value, decimal));

export {
  TokenValue,
  fromWei,
  toWei,
  toTokenBase,
  fromTokenBase,
  Wei,
  getDecimal
};
