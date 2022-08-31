import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import Bignumber from 'bignumber.js';
import BN from 'bn.js';

import { bigify, isBigish } from './bigify';

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
    const value = EthersBN.from('42');
    expect(isBigish(value)).toEqual(true);
  });
});

describe('bigify', () => {
  test('bigify supports very big numbers and decimals', () => {
    const input = '99999999999999999999999999999999999.999999999999999999999999999999';
    expect(bigify(input).toString()).toEqual(input);
  });
  test('bigify supports very big numbers with e notation', () => {
    const input = '2.297630401626e+22';
    expect(bigify(input).toString()).toEqual('22976304016260000000000');
  });
});
