import Big from 'big.js';
import { toFixedIfLarger, formatNumber } from '../../common/utils/formatters';

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
      output: '0.013'
    },
    {
      input: new Big('21.87468421'),
      output: '21.875'
    },
    {
      input: new Big(0),
      output: '0'
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
    const digits = pair.digits === undefined ? 'default' : pair.digits;
    it(`should convert ${pair.input.toString()} to ${pair.output} when using ${digits} digits`, () => {
      expect(formatNumber(pair.input, pair.digits)).toEqual(pair.output);
    });
  });
});
