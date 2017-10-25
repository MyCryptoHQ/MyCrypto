import Big from 'bignumber.js';
import {
  toFixedIfLarger,
  formatNumber,
  formatGasLimit
} from '../../common/utils/formatters';

describe('toFixedIfLarger', () => {
  it('should return same value if decimal isnt longer than default', () => {
    const numExample = 7.002;
    expect(toFixedIfLarger(numExample)).toEqual(String(numExample));
  });

  it('should return shortened value rounded up if decimal is longer than default', () => {
    const numExample = 7.1234567;
    expect(toFixedIfLarger(numExample)).toEqual(String(7.123457));
  });
  it('should return shortened value if decimal is longer than passed fixedSize', () => {
    const numExample = 7.12345678;
    expect(toFixedIfLarger(numExample, 2)).toEqual(String(7.12));
  });
});

describe('formatNumber', () => {
  const pairs = [
    {
      input: new Big('0.0127491'),
      output: '0.013',
      digits: undefined
    },
    {
      input: new Big('21.87468421'),
      output: '21.875',
      digits: undefined
    },
    {
      input: new Big(0),
      output: '0',
      digits: undefined
    },
    {
      input: new Big('354.4728173'),
      output: '354.4728',
      digits: 4
    },
    {
      input: new Big('100.48391'),
      output: '100',
      digits: 0
    }
  ];

  pairs.forEach(pair => {
    const digits = pair.digits;
    it(`should convert ${pair.input.toString()} to ${pair.output} when using ${digits} digits`, () => {
      expect(formatNumber(pair.input, pair.digits)).toEqual(pair.output);
    });
  });
});

describe('formatGasLimit', () => {
  it('should fix transaction gas limit off-by-one errors', () => {
    expect(formatGasLimit(new Big(21001), 'ether')).toEqual('21000');
  });

  it('should mark the gas limit `-1` if you exceed the limit per block', () => {
    expect(formatGasLimit(new Big(999999999999999), 'ether')).toEqual('-1');
  });

  it('should not alter a valid gas limit', () => {
    expect(formatGasLimit(new Big(1234))).toEqual('1234');
  });
});
