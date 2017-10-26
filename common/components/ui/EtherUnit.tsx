import React from 'react';
import { Wei, TokenValue } from 'libs/units';
import BN from 'bn.js';

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

const getDecimals = (key: UnitKey) => Units[key].length - 1;

interface Props {
  wei: Wei;
}
const stripRightZeros = (str: string) => {
  const strippedStr = str.replace(/0+$/, '');
  return strippedStr === '' ? null : strippedStr;
};

const toUnit = (value: BN, decimals: number) => {
  const sValue = value.toString();
  const paddedValue = sValue.padStart(decimals + 1, '0');
  const integerPart = paddedValue.slice(0, decimals);
  const fractionPart = stripRightZeros(paddedValue.slice(0, decimals));
  return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`;
};

const toEtherUnit = (wei: Wei, unit: UnitKey) => {
  const decimals = getDecimals(unit);
  return toUnit(wei, decimals);
};

const toTokenUnit = ({ value, decimal }: TokenValue) => toUnit(value, decimal);

//const Ether: React.SFC<Props> = ({wei}) => wei.
