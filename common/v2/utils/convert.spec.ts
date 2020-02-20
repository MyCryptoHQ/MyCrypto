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

describe('it Remove / Add commission from amount', () => {
  it('remove commission from decimal amount', () => {
    const expected = 195;
    const amount = 200;
    const converted = withCommission({
      amount,
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
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    expect(converted).toEqual(expected);
  });
  it('remove commission from float amount', () => {
    const expected = 467.24989328624764;
    const amount = 479.2306597807668;
    const converted = withCommission({
      amount,
      rate: MYC_DEXAG_COMMISSION_RATE,
      substract: true
    });
    expect(converted).toEqual(expected);
  });
  it('add commission from decimal amount', () => {
    const expected = 205;
    const amount = 200;
    const converted = withCommission({ amount, rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
  it('add commission from null amount', () => {
    const expected = 0;
    const amount = 0;
    const converted = withCommission({ amount, rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
  it('add commission from float amount', () => {
    const expected = 491.21142627528593;
    const amount = 479.2306597807668;
    const converted = withCommission({ amount, rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
  it('add commission from float amount', () => {
    const expected = 0.45795853102987494;
    const amount = 0.4467888107608536;
    const converted = withCommission({ amount, rate: MYC_DEXAG_COMMISSION_RATE });
    expect(converted).toEqual(expected);
  });
});
