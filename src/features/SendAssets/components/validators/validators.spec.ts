import { isHexPrefixed } from 'ethjs-util';

import { fAssets, fERC20TxSendFormikFields, fETHTxSendFormikFields } from '@fixtures';
import {
  gasLimitValidator,
  gasPriceValidator,
  isValidHex,
  isValidPositiveNumber,
  isValidPositiveOrZeroInteger
} from '@services/EthService';

import { canAffordTX } from '.';

describe('gasPriceValidators', () => {
  const failCases = ['0.00001', '1a', 'a1', 'a', '0', '-0.1', '3001'];
  const passCases = ['1', '0.1', '0.01', '2999', '3000'];

  it('must not be a non-zero, positive, floating-point number', () => {
    failCases.forEach((failCase) => {
      expect(gasPriceValidator(failCase)).toEqual(false);
    });
  });
  it('must be a non-zero, positive, floating-point number', () => {
    passCases.forEach((passCase) => {
      expect(gasPriceValidator(passCase)).toEqual(true);
    });
  });
});

describe('gasLimitValidator', () => {
  const failCases = ['0.00001', '1a', 'a1', 'a', '0', '-0.1', '20000'];
  const passCases = ['21000', '7999999'];

  it('must not be a positive integer between 21000 and 8000000', () => {
    failCases.forEach((failCase) => {
      expect(gasLimitValidator(failCase)).toEqual(false);
    });
  });
  it('must be a positive integer between 21000 and 8000000', () => {
    passCases.forEach((passCase) => {
      expect(gasLimitValidator(passCase)).toEqual(true);
    });
  });
});

describe('nonceValidator', () => {
  const failCases = ['0.00001', '1a', '0.1', 'a1', 'a', '-0.1'];
  const passCases = ['1', '0', '300'];

  it('must not be a positive integer greater than or equal to 0', () => {
    failCases.forEach((failCase) => {
      expect(isValidPositiveOrZeroInteger(failCase)).toEqual(false);
    });
  });
  it('must be a positive integer greater than or equal to 0', () => {
    passCases.forEach((passCase) => {
      expect(isValidPositiveOrZeroInteger(passCase)).toEqual(true);
    });
  });
});

describe('hexDataValidator', () => {
  const failCases = [
    '0.00001',
    '1a',
    'a1',
    'a',
    '0',
    '-0.1',
    '3001',
    '',
    '0x256609b2000000000000000000000000a715zab33c7baad0b55a3ee0e34f6c3d7d8bc29a'
  ];
  const passCases = [
    '0x256609b2000000000000000000000000a715aab33c7baad0b55a3ee0e34f6c3d7d8bc29a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000195480000000000000000000000000000000000000000000000000000000000019549000000000000000000000000000000000000000000000000000000000001954a000000000000000000000000000000000000000000000000000000000001954b000000000000000000000000000000000000000000000000000000000001954c000000000000000000000000000000000000000000000000000000000001954d000000000000000000000000000000000000000000000000000000000001954e000000000000000000000000000000000000000000000000000000000001954f00000000000000000000000000000000000000000000000000000000000195500000000000000000000000000000000000000000000000000000000000019551',
    '0x0',
    '0x'
  ];

  it('must not be a valid hexadecimal with "0x" prefix', () => {
    failCases.forEach((failCase) => {
      expect(isValidHex(failCase) && isHexPrefixed(failCase)).toEqual(false);
    });
  });
  it('must be a valid hexadecimal with "0x" prefix', () => {
    passCases.forEach((passCase) => {
      expect(isValidHex(passCase) && isHexPrefixed(passCase)).toEqual(true);
    });
  });
});

describe('amountValidator', () => {
  const failCases = ['1a', 'a1', 'a', '-0.1'];
  const passCases = ['1', '0.00001', '0.1', '0', '300'];

  it('must not be a floating-point number greater than or equal to 0', () => {
    failCases.forEach((failCase) => {
      expect(isValidPositiveNumber(failCase)).toEqual(false);
    });
  });
  it('must be a floating-point number greater than or equal to 0', () => {
    passCases.forEach((passCase) => {
      expect(isValidPositiveNumber(passCase)).toEqual(true);
    });
  });
});

describe('canAffordTX', () => {
  it('returns true if user can afford base asset tx', () => {
    expect(
      canAffordTX(fAssets[0], fETHTxSendFormikFields, fETHTxSendFormikFields.gasPriceField)
    ).toEqual(true);
  });

  it('returns false if user cant afford base asset tx', () => {
    expect(canAffordTX(fAssets[0], fETHTxSendFormikFields, '100000')).toEqual(false);
  });

  it('returns true if user can afford ERC20 tx', () => {
    expect(
      canAffordTX(fAssets[1], fERC20TxSendFormikFields, fERC20TxSendFormikFields.gasPriceField)
    ).toEqual(true);
  });

  it('returns false if user cant afford ERC20 tx', () => {
    expect(
      canAffordTX(
        fAssets[1],
        {
          ...fERC20TxSendFormikFields,
          gasLimitField: '85000'
        },
        '100000'
      )
    ).toEqual(false);
  });
});
