import Bignumber from 'bignumber.js';
import BN from 'bn.js';
import { bigNumberify } from 'ethers/utils';

import { isBigish } from './bigify';

describe('isBigish()', () => {
  test('a string is not bigish', () => {
    expect(isBigish('42')).toBeFalsy();
  });

  test('a number is not bigish', () => {
    expect(isBigish(42)).toBeFalsy();
  });

  test('an object is not bigish', () => {
    expect(isBigish({})).toBeFalsy();
  });

  test('a BN is bigish', () => {
    const value = new BN('42');
    expect(isBigish(value)).toEqual(true);
  });

  test('a Bignumber is bigish', () => {
    const value = new Bignumber('42');
    expect(isBigish(value)).toEqual(true);
  });

  test('a BigNumberish is a bigish', () => {
    const value = bigNumberify('42');
    expect(isBigish(value)).toEqual(true);
  });
});
