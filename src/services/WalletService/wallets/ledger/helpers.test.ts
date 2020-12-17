import { translateRaw } from '@translations';

import { isErrorWithId, isStringError, isU2FError, ledgerErrToMessage } from './helpers';
import { LedgerError } from './types';

const errorTestCases: LedgerError[] = [
  'error',
  {
    metaData: {
      type: 'BridgeError',
      code: 5
    }
  },
  'Error Connecting to device: 0x6804.',
  {
    message: 'BridgeError: U2F not supported',
    id: '0x6804',
    name: 'BridgeConnectError',
    stack: 'StackErr'
  }
];

describe('ledger wallet error type derivation', () => {
  it(`properly judges various test cases using isU2FError`, () => {
    const results = errorTestCases.map(isU2FError);
    expect(results).toStrictEqual([false, true, false, false]);
  });

  it(`properly judges various test cases using isStringError`, () => {
    const results = errorTestCases.map(isStringError);
    expect(results).toStrictEqual([true, false, true, false]);
  });

  it(`properly judges various test cases using isErrorWithId`, () => {
    const results = errorTestCases.map(isErrorWithId);
    expect(results).toStrictEqual([false, false, false, true]);
  });
});

describe('ledgerErrToMessage', () => {
  it('determines error message and derives a user-readable error message', () => {
    const results = errorTestCases.map(ledgerErrToMessage);
    expect(results).toStrictEqual([
      'error',
      translateRaw('LEDGER_TIMEOUT'),
      translateRaw('LEDGER_WRONG_APP'),
      translateRaw('U2F_NOT_SUPPORTED')
    ]);
  });
});
