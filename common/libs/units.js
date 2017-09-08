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

class Unit {
  unit: UNIT;
  amount: Big;

  constructor(amount: Big, unit: UNIT) {
    if (!(unit in UNITS)) {
      throw new Error(`Supplied unit: ${unit} is not a valid unit.`);
    }
    this.unit = unit;
    this.amount = amount;
  }

  toString(base?: number) {
    return this.amount.toString(base);
  }

  toWei(): Wei {
    return new Wei(toWei(this.amount, this.unit));
  }

  toGWei(): GWei {
    return new GWei(toUnit(this.amount, this.unit, 'gwei'));
  }

  toEther(): Ether {
    return new Ether(toUnit(this.amount, this.unit, 'ether'));
  }
}

export class Ether extends Unit {
  constructor(amount: Big | number | string) {
    super(new Big(amount), 'ether');
  }
}

export class Wei extends Unit {
  constructor(amount: Big | number | string) {
    super(new Big(amount), 'wei');
  }
}

export class GWei extends Unit {
  constructor(amount: Big | number | string) {
    super(new Big(amount), 'gwei');
  }
}

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
