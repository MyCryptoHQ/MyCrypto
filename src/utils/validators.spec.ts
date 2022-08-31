import { ETHUUID } from '@config';

import { isTransactionDataEmpty, isUuid, isValidAmount } from './validators';

describe('isUuid', () => {
  it('correctly identifies a uuid', () => {
    expect(isUuid(ETHUUID)).toBe(true);
  });

  it('correctly identifies an empty string to be an invalid uuid', () => {
    expect(isUuid('')).toBe(false);
  });

  it('correctly identifies an invalid uuid to be an invalid uuid', () => {
    expect(isUuid(`${ETHUUID}12345`)).toBe(false);
  });
});

describe('isTransactionDataEmpty', () => {
  const config = [
    {
      value: '0x',
      expected: true
    },
    {
      value: '0x0',
      expected: true
    },
    {
      value: '0x00',
      expected: true
    },
    {
      value: '',
      expected: true
    },
    {
      value:
        '0xa9059cbb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000156478f26d25f2de8a2',
      expected: false
    }
  ];
  config.map((item) => {
    it(`correctly identifies transaction data field ${item.value} as ${item.expected}`, () => {
      expect(isTransactionDataEmpty(item.value)).toEqual(item.expected);
    });
  });
});

describe('isValidAmount', () => {
  const config = [
    {
      value: '1',
      expected: true
    },
    {
      value: '0',
      expected: true
    },
    {
      value: '1.1',
      expected: true
    },
    {
      value: '-1',
      expected: false
    },
    {
      value: '-1.1',
      expected: false
    }
  ];
  config.map((item) => {
    it(`correctly validates isValidAmount of amount ${item.value} as ${item.expected}`, () => {
      expect(isValidAmount(18)(item.value)).toEqual(item.expected);
    });
  });
});
