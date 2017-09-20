import Big, { BigNumber } from 'bignumber.js';
import { Token } from 'config/data';

interface UNITS {
  wei: string;
  kwei: string;
  ada: string;
  femtoether: string;
  mwei: string;
  babbage: string;
  picoether: string;
  gwei: string;
  shannon: string;
  nanoether: string;
  nano: string;
  szabo: string;
  microether: string;
  micro: string;
  finney: string;
  milliether: string;
  milli: string;
  ether: string;
  kether: string;
  grand: string;
  einstein: string;
  mether: string;
  gether: string;
  tether: string;
}

const Units: UNITS = {
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

export type UNIT = keyof UNITS;

class Unit {
  public unit: UNIT;
  public amount: BigNumber;

  constructor(amount: BigNumber, unit: UNIT) {
    this.unit = unit;
    this.amount = amount;
  }

  public toString(base?: number) {
    return this.amount.toString(base);
  }

  public toPrecision(precision?: number) {
    return this.amount.toPrecision(precision);
  }

  public toWei(): Wei {
    return new Wei(toWei(this.amount, this.unit));
  }

  public toGWei(): GWei {
    return new GWei(toUnit(this.amount, this.unit, 'gwei'));
  }

  public toEther(): Ether {
    return new Ether(toUnit(this.amount, this.unit, 'ether'));
  }
}

export class Ether extends Unit {
  constructor(amount: BigNumber | number | string) {
    super(new Big(amount), 'ether');
  }
}

export class Wei extends Unit {
  constructor(amount: BigNumber | number | string) {
    super(new Big(amount), 'wei');
  }
}

export class GWei extends Unit {
  constructor(amount: BigNumber | number | string) {
    super(new Big(amount), 'gwei');
  }
}

function getValueOfUnit(unit: UNIT) {
  return new Big(Units[unit]);
}

export function toWei(number: BigNumber, unit: UNIT): BigNumber {
  return number.times(getValueOfUnit(unit));
}

export function toUnit(number: BigNumber, fromUnit: UNIT, toUnit: UNIT): BigNumber {
  return toWei(number, fromUnit).div(getValueOfUnit(toUnit));
}

export function toTokenUnit(number: BigNumber, token: Token): BigNumber {
  return number.times(new Big(10).pow(token.decimal));
}

export function toTokenDisplay(number: BigNumber, token: Token): BigNumber {
  return number.times(new Big(10).pow(-token.decimal));
}
