import { convertToFiatFromAsset } from './convert';
import { BigNumber } from 'ethers/utils';
import { StoreAsset, TAssetType, TUuid } from 'v2/types';

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
