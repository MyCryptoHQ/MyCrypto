import { DEFAULT_NETWORK } from '@config';
import { fAssets, fDAI, fNetworks, fStoreAssets } from '@fixtures';
import { TAddress } from '@types';

import { getAssetByContractAndNetwork, getAssetByContractAndNetworkId, getTotalByAsset } from '../helpers';

describe('getTotalByAsset()', () => {
  it('returns a list of unique assets', () => {
    const totals = getTotalByAsset([...fStoreAssets, ...fStoreAssets]);
    expect(Object.keys(totals)).toHaveLength(fStoreAssets.length);
  });
  it('sums the balances of each asset', () => {
    const totals = getTotalByAsset([...fStoreAssets, ...fStoreAssets]);
    const targetId = '01f2d4ec-c263-6ba8-de38-01d66c86f309';
    const targetAsset = fStoreAssets.find((a) => a.uuid === targetId);
    expect(totals[targetId].balance.toString()).toEqual(targetAsset!.balance.mul('2').toString());
  });
});

describe('getAssetByContractAndNetwork()', () => {
  it('returns undefined when contractAddress is undefined', () => {
    const asset = getAssetByContractAndNetwork(undefined, fNetworks[0])(fAssets);
    expect(asset).toBeUndefined();  
  });
  it('returns undefined when network is undefined is undefined', () => {
    const asset = getAssetByContractAndNetwork(fDAI.contractAddress, undefined)(fAssets);
    expect(asset).toBeUndefined();  
  });
  it('returns asset when asset is present in assets param', () => {
    const asset = getAssetByContractAndNetwork(fDAI.contractAddress, fNetworks[0])(fAssets);
    expect(asset).toStrictEqual(fDAI);  
  });
});

describe('getAssetByContractAndNetworkId()', () => {
  it('returns asset when asset is present in assets param', () => {
    const asset = getAssetByContractAndNetworkId(fAssets)(fDAI.contractAddress as TAddress, DEFAULT_NETWORK);
    expect(asset).toStrictEqual(fDAI);  
  });
});