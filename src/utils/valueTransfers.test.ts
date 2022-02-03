import { fAsset } from '@../jest_config/__fixtures__/assets';

import { fAssets, fContacts } from '@fixtures';
import { TAddress } from '@types';

import { addBaseAssetValueTransfer, addTransferEvent, buildTransferEvent } from './valueTransfers';

describe('addBaseAssetValueTransfer', () => {
  const baseAsset = fAssets[0]
  const toAddr = '0x0000000000000000000000000000000000000001' as TAddress
  const fromAddr = '0x0000000000000000000000000000000000000002' as TAddress

  it('adds base asset transfer on non-zero value field', () => {
    const valueField = '1000000000000000000'
    const result = addBaseAssetValueTransfer([], fromAddr, toAddr, valueField, baseAsset);
    expect(result).toStrictEqual([{ asset: fAssets[0], from: fromAddr, to: toAddr, amount: '1'}]);
  });

  it('adds base asset transfer on zero value field', () => {
    const valueField = '0'
    const result = addBaseAssetValueTransfer([], fromAddr, toAddr, valueField, baseAsset);
    expect(result).toStrictEqual([{ asset: fAssets[0], from: fromAddr, to: toAddr, amount: '0'}]);
  });
});

describe('buildTransferEvent', () => {
  const toAddr = '0x0000000000000000000000000000000000000001' as TAddress
  const fromAddr = '0x0000000000000000000000000000000000000002' as TAddress
  const contacts = fContacts
  const asset = fAsset;
  const assetRate = 0.1
  const amount = '1'
  const baseExpected = {
    to: toAddr,
    toContact: undefined,
    from: fromAddr,
    fromContact: undefined,
    asset,
    rate: assetRate,
    amount
  }
  
  it('correctly includes all values including undefined contacts', () => {
    const result = buildTransferEvent(baseExpected.to, baseExpected.toContact, baseExpected.from, baseExpected.fromContact, baseExpected.asset, baseExpected.rate, baseExpected.amount);
    expect(result).toStrictEqual(baseExpected);
  });

  it('correctly includes all values including defined contacts', () => {
    const expected = { ...baseExpected, to: contacts[0].address as TAddress, toContact: contacts[0], from: contacts[1].address as TAddress, fromContact: contacts[1] }
    const result = buildTransferEvent(expected.to, expected.toContact, expected.from, expected.fromContact, expected.asset, expected.rate, expected.amount);
    expect(result).toStrictEqual(expected);
  });

  it('correctly includes all values including undefined amount', () => {
    const expected = { ...baseExpected, to: contacts[0].address as TAddress, toContact: contacts[0], from: contacts[1].address as TAddress, fromContact: contacts[1], amount: undefined }
    const result = buildTransferEvent(expected.to, expected.toContact, expected.from, expected.fromContact, expected.asset, expected.rate, undefined);
    expect(result).toStrictEqual(expected);
  });
});

describe('addTransferEvent', () => {
  const toAddr = '0x0000000000000000000000000000000000000001' as TAddress
  const fromAddr = '0x0000000000000000000000000000000000000002' as TAddress
  const asset = fAsset;
  const assetRate = 0.1
  const amount = '1'
  
  it('adds a new transfer event to the empty arr includes all values including undefined contacts', () => {
    const result = addTransferEvent([], toAddr, undefined, fromAddr, undefined, asset, assetRate, amount);
    expect(result).toHaveLength(1);
  });
});