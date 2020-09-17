import {
  DAIUUID,
  ETHUUID,
  DEFAULT_NETWORK_CHAINID as networkChainId,
  DEFAULT_NETWORK as networkId
} from '@config';

import { generateAssetUUID, generateDeterministicAddressUUID, generateUUID } from './generateUUID';
import { isUuid } from './validators';

describe('it generates valid uuids deterministically from inputs', () => {
  it('generates a non-deterministic, but valid, uuid', () => {
    const uuid = generateUUID();
    expect(isUuid(uuid)).toBeTruthy();
  });

  it('generates a deterministic asset uuid for a token', () => {
    const daiContractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const actual = generateAssetUUID(networkChainId, daiContractAddress);
    expect(actual).toEqual(DAIUUID);
  });

  it('generates a deterministic asset uuid for a base asset', () => {
    const actual = generateAssetUUID(networkChainId);
    expect(actual).toEqual(ETHUUID);
  });

  it('generates a deterministic address uuid', () => {
    const address = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520';
    const accountUuid = '624d4cb6-b9ba-5b46-b40b-02bf4e435b08';
    const actual = generateDeterministicAddressUUID(networkId, address);
    expect(actual).toEqual(accountUuid);
  });
});
