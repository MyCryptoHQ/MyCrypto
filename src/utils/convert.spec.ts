import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';
import BigNumberJs from 'bignumber.js';

import { DEFAULT_NETWORK, MYC_DEX_COMMISSION_RATE } from '@config';
import { StoreAsset } from '@types';

import { bigify } from './bigify';
import {
  addBNFloats,
  convertToBN,
  convertToFiatFromAsset,
  divideBNFloats,
  multiplyBNFloats,
  subtractBNFloats,
  trimBN,
  withCommission
} from './convert';

const defaultAsset = {
  name: 'FakeToken',
  uuid: 'FakeTokenUUID',
  type: 'erc20',
  ticker: 'FTKN',
  balance: BigNumber.from('1'),
  decimal: 18,
  networkId: DEFAULT_NETWORK
} as StoreAsset;

describe('convert()', () => {
  it('converts some balance to fiat', () => {
    const expected = '2.86756';
    const rate = 0.00008434;
    const assetObject: StoreAsset = Object.assign({}, defaultAsset, {
      balance: BigNumber.from('34000000000000000000000')
    });
    const converted = convertToFiatFromAsset(assetObject, rate);
    expect(converted).toEqual(expected);
  });

  it('converts some balance to fiat (1)', () => {
    const expected = '0.4582269583';
    const rate = 0.001867;
    const assetObject: StoreAsset = Object.assign({}, defaultAsset, {
      balance: BigNumber.from('245434900000000000000')
    });
    const converted = convertToFiatFromAsset(assetObject, rate);
    expect(converted).toEqual(expected);
  });

  it('converts some balance to fiat (2)', () => {
    const expected = '608.342632226824';
    const rate = 169.48;
    const assetObject: StoreAsset = Object.assign({}, defaultAsset, {
      balance: BigNumber.from('3589465613800000000')
    });
    const converted = convertToFiatFromAsset(assetObject, rate);
    expect(converted).toEqual(expected);
  });
});

describe('it divides BigNumber decimal numbers together', () => {
  const convertTest = (amount: number, divisor: number) => {
    const amountBN = bigify(amount);
    const divisorBN = bigify(divisor);

    return trimBN(amountBN.dividedBy(divisorBN).toString());
  };
  it('divides some decimal amount by a float divisor', () => {
    const divisor = 1914.9054605256267;
    const original = 2;
    const expected = convertTest(original, divisor);
    const converted = divideBNFloats(original, divisor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });
  it('divides some float amount by a decimal divisor', () => {
    const divisor = 2;
    const original = 1914.9054605256267;
    const expected = convertTest(original, divisor);
    const converted = divideBNFloats(original, divisor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });
  it('divides some float amount by a float amount', () => {
    const rate = 648931.7247453306;
    const original = 0.0010249999999999999;
    const expected = '0.000000001579519';
    const converted = divideBNFloats(original, rate);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });
  it('should be a ether.js BigNumber', () => {
    const divisor = 2;
    const original = 1914.9054605256267;
    const converted = divideBNFloats(original, divisor);
    expect(converted instanceof BigNumber).toBeTruthy();
  });
});

describe('it multiplies BigNumber decimal numbers together', () => {
  const convertTest = (amount: number, divisor: number) => {
    const amountBN = bigify(amount);
    const divisorBN = bigify(divisor);

    return trimBN(amountBN.times(divisorBN).toString());
  };

  it('multiplies a decimal amount by a float rate', () => {
    const rate = 1914.9054605256267;
    const original = 2;
    const expected = convertTest(original, rate);
    const converted = multiplyBNFloats(original, rate);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('multiplies a float amount by a decimal rate', () => {
    const rate = 2;
    const original = 1914.9054605256267;
    const expected = convertTest(original, rate);
    const converted = multiplyBNFloats(original, rate);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('multiplies a float amount by a float amount', () => {
    const rate = 648931.7247453306;
    const original = 0.0010249999999999999;
    const expected = '665.1550178639638';
    const converted = multiplyBNFloats(original, rate);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('should be a ether.js BigNumber', () => {
    const rate = 2;
    const original = 1914.9054605256267;
    const converted = multiplyBNFloats(original, rate);
    expect(converted instanceof BigNumber).toBeTruthy();
  });
});

describe('it adds BigNumber floating point numbers together', () => {
  const convertTest = (amount: number, additor: number) => {
    const amountBN = bigify(amount);
    const additorBN = bigify(additor);

    return trimBN(BigNumberJs.sum(amountBN, additorBN).toString());
  };

  it('adds a decimal amount to a float amount', () => {
    const amount = 1914.9054605256267;
    const additor = 2;
    const expected = convertTest(amount, additor);
    const converted = addBNFloats(amount, additor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('adds a float amount to a decimal amount', () => {
    const amount = 2;
    const additor = 1914.9054605256267;
    const expected = convertTest(amount, additor);
    const converted = addBNFloats(amount, additor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('adds a float amount to a float amount', () => {
    const amount = 648931.7247453306;
    const additor = 0.0010249999999999999;
    const expected = '648931.7257703306';
    const converted = addBNFloats(amount, additor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('should be a ether.js BigNumber', () => {
    const amount = 2;
    const additor = 1914.9054605256267;
    const converted = addBNFloats(amount, additor);
    expect(converted instanceof BigNumber).toBeTruthy();
  });
});

describe('it subtracts BigNumber floating point numbers from each other', () => {
  const convertTest = (amount: number, subtractor: number) => {
    const amountBN = bigify(amount);
    const subtractorBN = bigify(subtractor);

    return trimBN(BigNumberJs.sum(amountBN, subtractorBN.negated()).toString());
  };

  it('subtracts a float amount from a decimal amount', () => {
    const subtractor = 1914.9054605256267;
    const amount = 2;
    const expected = convertTest(amount, subtractor);
    const converted = subtractBNFloats(amount, subtractor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('subtracts a decimal amount from a float amount', () => {
    const subtractor = 2;
    const amount = 1914.9054605256267;
    const expected = convertTest(amount, subtractor);
    const converted = subtractBNFloats(amount, subtractor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('subtracts a float amount from a float amount', () => {
    const subtractor = 648931.7247453306;
    const amount = 0.0010249999999999999;
    const expected = '-648931.7237203306';
    const converted = subtractBNFloats(amount, subtractor);
    expect(trimBN(formatEther(converted))).toEqual(expected);
  });

  it('should be a ether.js BigNumber', () => {
    const subtractor = 2;
    const amount = 1914.9054605256267;
    const converted = subtractBNFloats(amount, subtractor);
    expect(converted instanceof BigNumber).toBeTruthy();
  });
});

describe('it Remove / Add commission from amount', () => {
  const withCommissionTest = ({
    amount,
    rate,
    substract
  }: {
    amount: number;
    rate: number;
    substract?: boolean;
  }) => {
    const amountBN = new BigNumberJs(amount);
    const rateBN = new BigNumberJs(substract ? 1.0 - rate : 1.0 + rate);
    return bigify(trimBN(amountBN.times(rateBN).toString()));
  };
  it('remove commission from decimal amount', () => {
    const expected = bigify(199.5);
    const amount = 200;
    const converted = withCommission({
      amount: convertToBN(amount),
      rate: MYC_DEX_COMMISSION_RATE,
      subtract: true
    });
    expect(converted).toEqual(expected);
  });
  it('remove commission from null amount', () => {
    const amount = 0;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEX_COMMISSION_RATE,
      substract: true
    });
    const converted = withCommission({
      amount: convertToBN(amount),
      rate: MYC_DEX_COMMISSION_RATE,
      subtract: true
    });
    expect(converted).toEqual(expected);
  });
  it('add commission from decimal amount', () => {
    const amount = 200;
    const expected = withCommissionTest({ amount, rate: MYC_DEX_COMMISSION_RATE });
    const converted = withCommission({
      amount: convertToBN(amount),
      rate: MYC_DEX_COMMISSION_RATE
    });
    expect(converted).toEqual(expected);
  });
  it('add commission from null amount', () => {
    const amount = 0;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEX_COMMISSION_RATE
    });
    const converted = withCommission({
      amount: convertToBN(amount),
      rate: MYC_DEX_COMMISSION_RATE
    });
    expect(converted).toEqual(expected);
  });
  it('add commission from float amount', () => {
    const amount = 479.230659764268923;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEX_COMMISSION_RATE
    });
    const converted = withCommission({
      amount: convertToBN(amount),
      rate: MYC_DEX_COMMISSION_RATE
    });
    expect(converted).toEqual(expected);
  });
});
