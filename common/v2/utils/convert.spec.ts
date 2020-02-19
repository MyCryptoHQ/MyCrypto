import BigNumberJs from 'bignumber.js';
import { BigNumber, formatEther } from 'ethers/utils';
import { convertToFiatFromAsset, withCommission, convert } from './convert';
import { StoreAsset, TAssetType, TUuid } from 'v2/types';
import { MYC_DEXAG_COMMISSION_RATE } from 'v2/config';

describe('it converts balance to fiat', () => {
  it('converts some balance to fiat', () => {
    const expected = 2.86756;
    const rate = 0.00008434;
    const assetObject: StoreAsset = {
      name: 'FakeToken',
      uuid: 'FakeTokenUUID' as TUuid,
      type: 'erc20' as TAssetType,
      ticker: 'FTKN',
      mtime: new Date().valueOf(),
      balance: new BigNumber('34000000000000000000000'),
      decimal: 18
    };
    const converted = convertToFiatFromAsset(assetObject, rate);
    expect(converted).toEqual(expected);
  });

  it('converts some balance to fiat', () => {
    const expected = 0.4582269583;
    const rate = 0.001867;
    const assetObject: StoreAsset = {
      name: 'FakeToken',
      uuid: 'FakeTokenUUID' as TUuid,
      type: 'erc20' as TAssetType,
      ticker: 'FTKN',
      mtime: new Date().valueOf(),
      balance: new BigNumber('245434900000000000000'),
      decimal: 18
    };
    const converted = convertToFiatFromAsset(assetObject, rate);
    expect(converted).toEqual(expected);
  });

  it('converts some balance to fiat', () => {
    const expected = 608.342632226824;
    const rate = 169.48;
    const assetObject: StoreAsset = {
      name: 'FakeToken',
      uuid: 'FakeTokenUUID' as TUuid,
      type: 'erc20' as TAssetType,
      ticker: 'FTKN',
      mtime: new Date().valueOf(),
      balance: new BigNumber('3589465613800000000'),
      decimal: 18
    };
    const converted = convertToFiatFromAsset(assetObject, rate);
    expect(converted).toEqual(expected);
  });
});

describe('it converts an asset to another', () => {
  const convertTest = (amount: number, rate: number) => {
    const amountBN = new BigNumberJs(amount);
    const rateBN = new BigNumberJs(rate);

    return amountBN.times(rateBN).toString();
  };
  it('convert a decimal amount with a float rate', () => {
    const rate = 1914.9054605256267;
    const original = 2;
    const expected = convertTest(original, rate);
    const converted = convert(original, rate);
    expect(formatEther(converted)).toEqual(expected);
  });
  it('convert a float amount with a decimal rate', () => {
    const rate = 2;
    const original = 1914.9054605256267;
    const expected = convertTest(original, rate);
    const converted = convert(original, rate);
    expect(formatEther(converted)).toEqual(expected);
  });
  it('should be a ether.js BigNumber', () => {
    const rate = 2;
    const original = 1914.9054605256267;
    const converted = convert(original, rate);
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
    const rateBN = new BigNumberJs((substract ? 100 - rate : 100 + rate) / 100);

    return amountBN.times(rateBN).toNumber();
  };
  it('remove commission from decimal amount', () => {
    const amount = 200;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    const converted = withCommission({
      amount: convert(amount),
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    expect(converted).toEqual(expected);
  });
  it('remove commission from null amount', () => {
    const amount = 0;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    const converted = withCommission({
      amount: convert(amount),
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    expect(converted).toEqual(expected);
  });
  it('remove commission from float amount', () => {
    const amount = 479.230659765053;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    const converted = withCommission({
      amount: convert(amount),
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    expect(converted).toEqual(expected);
  });
  it('add commission from decimal amount', () => {
    const amount = 200;
    const expected = withCommissionTest({ amount, rate: MYC_DEXAG_COMMISSION_RATE });
    const converted = withCommission({ amount: convert(amount), rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
  it('add commission from null amount', () => {
    const amount = 0;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE
    });
    const converted = withCommission({ amount: convert(amount), rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
  it('add commission from float amount', () => {
    const amount = 479.230659764268923;
    const expected = withCommissionTest({
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE
    });
    const converted = withCommission({ amount: convert(amount), rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
});
