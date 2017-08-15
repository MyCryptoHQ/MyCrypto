// @flow
import Big from 'bignumber.js';
import type { Token } from 'config/data';

const UNITS = {
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

export type UNIT = $Keys<typeof UNITS>;

function getValueOfUnit(unit: UNIT) {
  return new Big(UNITS[unit]);
}

export function toWei(number: Big, unit: UNIT): Big {
  return number.times(getValueOfUnit(unit));
}

export function toUnit(number: Big, fromUnit: UNIT, toUnit: UNIT): Big {
  return toWei(number, fromUnit).div(getValueOfUnit(toUnit));
}

export function toTokenUnit(number: Big, token: Token): Big {
  return number.times(new Big(10).pow(token.decimal));
}

export function toTokenDisplay(number: Big, token: Token): Big {
  return number.times(new Big(10).pow(-token.decimal));
}
