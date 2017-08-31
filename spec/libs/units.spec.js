import Big from 'bignumber.js';
import { toWei, toUnit } from '../../common/libs/units';

describe('Units', () => {
  describe('toWei', () => {
    const conversions = [
      {
        value: '0.001371',
        unit: 'ether',
        wei: '1371000000000000'
      },
      {
        value: '9',
        unit: 'gwei',
        wei: '9000000000'
      }
    ];

    conversions.forEach(c => {
      it(`should return '${c.wei}' given ${c.value} ${c.unit}`, () => {
        const big = new Big(c.value);
        expect(toWei(big, c.unit).toString()).toEqual(c.wei);
      });
    });
  });

  describe('toUnit', () => {
    const conversions = [
      {
        value: '.41849',
        fromUnit: 'ether',
        toUnit: 'gwei',
        output: '418490000'
      },
      {
        value: '4924.71',
        fromUnit: 'nanoether',
        toUnit: 'szabo',
        output: '4.92471'
      }
    ];

    conversions.forEach(c => {
      it(`should return '${c.output}' when converting ${c.value} ${c.fromUnit} to ${c.toUnit}`, () => {
        const big = new Big(c.value);
        expect(toUnit(big, c.fromUnit, c.toUnit).toString()).toEqual(c.output);
      });
    });
  });
});
