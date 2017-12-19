import { Wei } from 'libs/units';
import {
  toFixedIfLarger,
  formatNumber,
  formatGasLimit,
  formatMnemonic
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
      input: '0.0127491',
      output: '0.013',
      digits: undefined
    },
    {
      input: '21.87468421',
      output: '21.875',
      digits: undefined
    },
    {
      input: '0',
      output: '0',
      digits: undefined
    },
    {
      input: '354.4728173',
      output: '354.4728',
      digits: 4
    },
    {
      input: '100.48391',
      output: '100',
      digits: 0
    },
    {
      input: '239.999632',
      output: '240',
      digits: 0
    },
    {
      input: '999.999',
      output: '1,000',
      digits: 0
    },
    {
      input: '0.9',
      output: '1',
      digits: 0
    },
    {
      input: '0.09',
      output: '0.1',
      digits: 1
    }
  ];

  pairs.forEach(pair => {
    const digits = pair.digits;
    it(`should convert ${pair.input.toString()} to ${
      pair.output
    } when using ${digits} digits`, () => {
      expect(formatNumber(pair.input, pair.digits)).toEqual(pair.output);
    });
  });
});

describe('formatGasLimit', () => {
  it('should fix transaction gas limit off-by-one errors', () => {
    expect(formatGasLimit(Wei('21001'), 'ether')).toEqual('21000');
  });

  it('should mark the gas limit `-1` if you exceed the limit per block', () => {
    expect(formatGasLimit(Wei('999999999999999'), 'ether')).toEqual('-1');
  });

  it('should not alter a valid gas limit', () => {
    expect(formatGasLimit(Wei('1234'))).toEqual('1234');
  });
});

describe('formatMnemonic', () => {
  const testPhraseNewLines =
    'first\ncatalog\naway\nfaculty\njelly\nnow\nlife\nkingdom\npigeon\nraise\ngain\naccident';
  const testPhraseExtraSpaces =
    'first catalog   away faculty  jelly    now life kingdom pigeon raise gain accident      ';
  const testPhraseCommas =
    'first,catalog,away,faculty,jelly,now,life,kingdom,pigeon,raise,gain,accident';
  const formattedTestPhrase =
    'first catalog away faculty jelly now life kingdom pigeon raise gain accident';

  it('should format phrases with new lines as a phrase with just spaces', () => {
    expect(formatMnemonic(testPhraseNewLines)).toEqual(formattedTestPhrase);
  });

  it('should remove commas and replace with space characters', () => {
    expect(formatMnemonic(testPhraseCommas)).toEqual(formattedTestPhrase);
  });

  it('should trim any stray space characters throughout the phrase', () => {
    expect(formatMnemonic(testPhraseExtraSpaces)).toEqual(formattedTestPhrase);
  });
});
