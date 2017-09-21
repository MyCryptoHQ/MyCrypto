import Big, { BigNumber } from 'bignumber.js';
import { Token } from 'config/data';

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

export type TUnit = typeof Units;
export type UnitKey = keyof TUnit;

class Unit {
  public unit: UnitKey;
  public amount: BigNumber;

  constructor(amount: BigNumber, unit: UnitKey) {
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

// tslint:disable:max-classes-per-file
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

function getValueOfUnit(unit: UnitKey) {
  return new Big(Units[unit]);
}

export function toWei(num: BigNumber, unit: UnitKey): BigNumber {
  return num.times(getValueOfUnit(unit));
}

export function toUnit(
  num: BigNumber,
  fromUnit: UnitKey,
  convertToUnit: UnitKey
): BigNumber {
  return toWei(num, fromUnit).div(getValueOfUnit(convertToUnit));
}

export function toTokenUnit(num: BigNumber, token: Token): BigNumber {
  return num.times(new Big(10).pow(token.decimal));
}

export function toTokenDisplay(num: BigNumber, token: Token): BigNumber {
  return num.times(new Big(10).pow(-token.decimal));
}
