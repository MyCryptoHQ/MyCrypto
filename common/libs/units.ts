import BN from 'bn.js';
import { toBuffer, addHexPrefix } from 'ethereumjs-util';
import { stripHexPrefix } from 'libs/values';

type UnitKey = keyof typeof Units;
type Wei = BN;
type TokenValue = BN;
type Address = Buffer;
type Nonce = BN;
type Data = Buffer;

export const ETH_DECIMAL = 18;

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
const handleValues = (input: string | BN) => {
  if (typeof input === 'string') {
    return input.startsWith('0x') ? new BN(stripHexPrefix(input), 16) : new BN(input);
  }
  if (typeof input === 'number') {
    return new BN(input);
  }
  if (BN.isBN(input)) {
    return input;
  } else {
    throw Error('unsupported value conversion');
  }
};

const Address = (input: string) => toBuffer(addHexPrefix(input));

const Data = (input: string) => toBuffer(addHexPrefix(input));

const Nonce = (input: string | BN) => handleValues(input);

const Wei = (input: string | BN): Wei => handleValues(input);

const TokenValue = (input: string | BN) => handleValues(input);

const getDecimalFromEtherUnit = (key: UnitKey) => Units[key].length - 1;

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

const fromWei = (wei: Wei, unit: UnitKey) => {
  const decimal = getDecimalFromEtherUnit(unit);
  return baseToConvertedUnit(wei.toString(), decimal);
};

const toWei = (value: string, decimal: number): Wei => {
  const wei = convertedToBaseUnit(value, decimal);
  return Wei(wei);
};

const fromTokenBase = (value: TokenValue, decimal: number) =>
  baseToConvertedUnit(value.toString(), decimal);

const toTokenBase = (value: string, decimal: number) =>
  TokenValue(convertedToBaseUnit(value, decimal));

const isEtherUnit = (unit: string) => unit === 'ether' || unit === 'ETH';

const convertTokenBase = (value: TokenValue, oldDecimal: number, newDecimal: number) => {
  if (oldDecimal === newDecimal) {
    return value;
  }
  return toTokenBase(fromTokenBase(value, oldDecimal), newDecimal);
};

const gasPricetoBase = (price: number) => toWei(price.toString(), getDecimalFromEtherUnit('gwei'));

export {
  isEtherUnit,
  Data,
  Address,
  TokenValue,
  fromWei,
  toWei,
  toTokenBase,
  fromTokenBase,
  convertTokenBase,
  Wei,
  getDecimalFromEtherUnit,
  UnitKey,
  Nonce,
  handleValues,
  gasPricetoBase
};
