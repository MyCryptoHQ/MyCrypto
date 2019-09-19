import {
  gasPriceValidator,
  gasLimitValidator,
  isValidHex,
  isValidPositiveOrZeroInteger,
  isValidPositiveNumber
} from 'v2/services/EthService';
import { isHexPrefixed } from 'ethjs-util';

describe('gasPriceValidators', () => {
  const failCases = ['0.00001', '1a', 'a1', 'a', '0', '-0.1', '3001'];
  const passCases = ['1', '0.1', '0.01', '2999', '3000'];

  it('should fail gasPrice validation', () => {
    failCases.forEach(failCase => {
      expect(gasPriceValidator(failCase)).toEqual(false);
    });
  });
  it('should pass gasPrice validation', () => {
    passCases.forEach(passCase => {
      expect(gasPriceValidator(passCase)).toEqual(true);
    });
  });
});

describe('gasLimitValidator', () => {
  const failCases = ['0.00001', '1a', 'a1', 'a', '0', '-0.1', '20000'];
  const passCases = ['21000', '7999999'];

  it('should fail gasPrice validation', () => {
    failCases.forEach(failCase => {
      expect(gasLimitValidator(failCase)).toEqual(false);
    });
  });
  it('should pass gasPrice validation', () => {
    passCases.forEach(passCase => {
      expect(gasLimitValidator(passCase)).toEqual(true);
    });
  });
});

describe('nonceValidator', () => {
  const failCases = ['0.00001', '1a', '0.1', 'a1', 'a', '-0.1'];
  const passCases = ['1', '0', '300'];

  it('should fail nonce validation', () => {
    failCases.forEach(failCase => {
      expect(isValidPositiveOrZeroInteger(failCase)).toEqual(false);
    });
  });
  it('should pass nonce validation', () => {
    passCases.forEach(passCase => {
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

  it('should fail hex data validation', () => {
    failCases.forEach(failCase => {
      expect(isValidHex(failCase) && isHexPrefixed(failCase)).toEqual(false);
    });
  });
  it('should pass hex data validation', () => {
    passCases.forEach(passCase => {
      expect(isValidHex(passCase) && isHexPrefixed(passCase)).toEqual(true);
    });
  });
});

describe('amountValidator', () => {
  const failCases = ['1a', 'a1', 'a', '-0.1'];
  const passCases = ['1', '0.00001', '0.1', '0', '300'];

  it('should fail amount validation', () => {
    failCases.forEach(failCase => {
      expect(isValidPositiveNumber(failCase)).toEqual(false);
    });
  });
  it('should pass amount validation', () => {
    passCases.forEach(passCase => {
      expect(isValidPositiveNumber(passCase)).toEqual(true);
    });
  });
});
