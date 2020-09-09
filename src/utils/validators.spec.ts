import { ETHUUID } from '@utils';
import { isValidUuid, isTransactionDataEmpty, isValidAmount } from './validators';

describe('isValidUuid', () => {
  it('correctly identifies a uuid', () => {
    const testUuid = ETHUUID;
    expect(isValidUuid(testUuid)).toBeTruthy();
  });

  it('correctly identifies an empty string to be an invalid uuid', () => {
    expect(isValidUuid('')).toBeFalsy();
  });

  it('correctly identifies an invalid uuid to be an invalid uuid', () => {
    expect(isValidUuid(`${ETHUUID}12345`)).toBeFalsy();
  });
});

describe('isTransactionDataEmpty', () => {
  const config = [
    {
      value: '0x',
      result: true
    },
    {
      value: '0x0',
      result: true
    },
    {
      value: '0x00',
      result: true
    },
    {
      value: '',
      result: true
    },
    {
      value:
        '0xa9059cbb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000156478f26d25f2de8a2',
      result: false
    }
  ];
  config.map((item) => {
    it(`correctly identifies transaction data field ${item.value} as ${item.result}`, () => {
      expect(isTransactionDataEmpty(item.value)).toEqual(item.result);
    });
  });
});

describe('isValidAmount', () => {
  const config = [
    {
      value: '1',
      result: true
    },
    {
      value: '0',
      result: true
    },
    {
      value: '1.1',
      result: true
    },
    {
      value: '-1',
      result: false
    },
    {
      value: '-1.1',
      result: false
    }
  ];
  config.map((item) => {
    it(`correctly validates isValidAmount of amount ${item.value} as ${item.result}`, () => {
      expect(isValidAmount(18)(item.value)).toEqual(item.result);
    });
  });
});
