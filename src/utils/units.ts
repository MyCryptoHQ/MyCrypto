import BigNumber from 'bignumber.js';
import { addHexPrefix, toBuffer } from 'ethereumjs-util';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { BigifySupported, Bigish } from '@types';

import { bigify } from './bigify';

type UnitKey = keyof typeof Units;
type Wei = BigNumber;
type TokenValue = BigNumber;
type Address = Buffer;
type Nonce = BigNumber;
type Data = Buffer;

export const Units = {
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
const handleValues = (input: BigifySupported) => {
  return bigify(input);
};

const Address = (input: string) => toBuffer(addHexPrefix(input));

const Data = (input: string) => toBuffer(addHexPrefix(input));

const Nonce = (input: string | BigNumber) => handleValues(input);

const Wei = (input: string | BigNumber): Wei => handleValues(input);

const TokenValue = (input: string | BigNumber) => handleValues(input);

const getDecimalFromEtherUnit = (key: UnitKey) => Units[key].length - 1;

const stripRightZeros = (str: string) => {
  const strippedStr = str.replace(/0+$/, '');
  return strippedStr === '' ? null : strippedStr;
};

export const baseToConvertedUnit = (value: string, decimal: number) => {
  if (decimal === 0) {
    return value;
  }
  const paddedValue = value.padStart(decimal + 1, '0'); //0.1 ==>
  const integerPart = paddedValue.slice(0, -decimal);
  const fractionPart = stripRightZeros(paddedValue.slice(-decimal));
  return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`;
};

export const convertedToBaseUnit = (value: string, decimal: number) => {
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

const toWei = (value: BigifySupported, decimal: number): Wei => {
  const wei = convertedToBaseUnit(bigify(value).toString(10), decimal);
  return Wei(wei);
};

const fromTokenBase = (value: TokenValue, decimal: number = DEFAULT_ASSET_DECIMAL) =>
  baseToConvertedUnit(value.toString(), decimal);

const toTokenBase = (value: string, decimal: number) =>
  TokenValue(convertedToBaseUnit(value, decimal));

const convertTokenBase = (value: TokenValue, oldDecimal: number, newDecimal: number) => {
  if (oldDecimal === newDecimal) {
    return value;
  }
  return toTokenBase(fromTokenBase(value, oldDecimal), newDecimal);
};

export const getDecimals = (value: string) =>
  value.includes('.') ? value.split('.')[1].length : 0;

const calculateGasUsedPercentage = (gasLimit: string, gasUsed: string) => {
  const gasLimitBN = bigify(gasLimit);
  const gasUsedBN = bigify(gasUsed);
  return gasUsedBN.div(gasLimitBN).multipliedBy(bigify(100));
};

const gasPriceToBase = (price: string | number) =>
  toWei(price.toString(10), getDecimalFromEtherUnit('gwei'));

const totalTxFeeToString = (
  gasPriceEther: string | BigNumber,
  gasLimit: string | BigNumber
): string => bigify(fromWei(totalTxFeeToWei(gasPriceEther, gasLimit), 'ether')).toFixed(6);

const totalTxFeeToWei = (gasPriceEther: string | Bigish, gasLimit: string | Bigish): Wei =>
  bigify(gasPriceEther).multipliedBy(gasLimit);

const gasStringsToMaxGasBN = (gasPriceGwei: string, gasLimit: string): BigNumber => {
  return gasPriceToBase(gasPriceGwei).multipliedBy(gasLimit);
};

// @todo Rename
const gasStringsToMaxGasNumber = (gasPriceGwei: string, gasLimit: string): BigNumber => {
  return bigify(
    baseToConvertedUnit(
      gasStringsToMaxGasBN(gasPriceGwei, gasLimit).toString(),
      DEFAULT_ASSET_DECIMAL
    )
  );
};

export {
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
  gasPriceToBase,
  totalTxFeeToString,
  totalTxFeeToWei,
  gasStringsToMaxGasBN,
  gasStringsToMaxGasNumber,
  calculateGasUsedPercentage
};
