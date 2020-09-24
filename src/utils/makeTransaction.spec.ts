import BigNumber from 'bignumber.js';

import {
  bigNumGasLimitToViewable,
  bigNumGasPriceToViewableGwei,
  bigNumValueToViewableEther,
  hexNonceToViewable,
  hexToString,
  hexWeiToString,
  inputGasLimitToHex,
  inputGasPriceToHex,
  inputNonceToHex,
  inputValueToHex
} from './makeTransaction';

describe('inputGasPriceToHex', () => {
  it('calculates hex gas price from input gas price', () => {
    const actual = inputGasPriceToHex('22');
    expect(actual).toBe('0x51f4d5c00');
  });
});

describe('inputGasLimitToHex', () => {
  it('calculates hex gas limit from input gas limit', () => {
    const actual = inputGasLimitToHex('21000');
    expect(actual).toBe('0x5208');
  });
});

describe('inputValueToHex', () => {
  it('calculates amount hex value from an input amount', () => {
    const actual = inputValueToHex('1');
    expect(actual).toBe('0xde0b6b3a7640000');
  });
});

describe('inputNonceToHex', () => {
  it('calculates nonce hex value from input value', () => {
    const actual = inputNonceToHex('1');
    expect(actual).toBe('0x1');
  });
});

describe('hexNonceToViewable', () => {
  it('determines viewable nonce value from hex viewable', () => {
    const actual = hexNonceToViewable('0x04');
    expect(actual).toBe('4');
  });
});

describe('hexToString', () => {
  it('calculates string from hex string value', () => {
    const actual = hexToString('0x01');
    expect(actual).toBe('1');
  });
});

describe('hexWeiToString', () => {
  it('calculates string from hex wei value', () => {
    const actual = hexWeiToString('0xde0b6b3a7640000');
    expect(actual).toBe('1000000000000000000');
  });
});

describe('bigNumGasPriceToViewableGwei', () => {
  it('calculates viewable gas price from wei gas price string', () => {
    const actual = bigNumGasPriceToViewableGwei('10000000000');
    expect(actual).toBe('10');
  });

  it('calculates viewable gas price from wei gas price big number', () => {
    const actual = bigNumGasPriceToViewableGwei(new BigNumber('10000000000'));
    expect(actual).toBe('10');
  });
});

describe('bigNumGasLimitToViewable', () => {
  it('calculates viewable gas limit from gas limit string', () => {
    const actual = bigNumGasLimitToViewable('21000');
    expect(actual).toBe('21000');
  });
  it('calculates viewable gas limit from big number gas limit', () => {
    const actual = bigNumGasLimitToViewable(new BigNumber('21000'));
    expect(actual).toBe('21000');
  });
});

describe('bigNumValueToViewableEther', () => {
  it('calculates viewable eth value from wei string', () => {
    const actual = bigNumValueToViewableEther('1000000000000000000');
    expect(actual).toBe('1.0');
  });

  it('calculates viewable eth value from wei big number', () => {
    const actual = bigNumValueToViewableEther(new BigNumber('1000000000000000000'));
    expect(actual).toBe('1.0');
  });
});
