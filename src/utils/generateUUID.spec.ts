import { DEFAULT_NETWORK, DEFAULT_NETWORK_CHAINID } from '@config';

import { DAIUUID, ETHUUID } from './constants';
import { generateAssetUUID, generateDeterministicAddressUUID, generateUUID } from './generateUUID';
import { isValidUuid } from './validators';

describe('it generates valid uuids deterministically from inputs', () => {
  const networkId = DEFAULT_NETWORK;
  const networkChainId = DEFAULT_NETWORK_CHAINID;
  const testAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520';
  const testAccountUuid = '624d4cb6-b9ba-5b46-b40b-02bf4e435b08';

  it('generates a non-deterministic, but valid, uuid', () => {
    const uuid = generateUUID();
    expect(isValidUuid(uuid)).toBeTruthy();
  });

  it('generates a deterministic asset uuid for a token', () => {
    const testContractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const testTokenUuid = DAIUUID;
    const uuid = generateAssetUUID(networkChainId, testContractAddress);
    expect(uuid).toEqual(testTokenUuid);
  });

  it('generates a deterministic asset uuid for a base asset', () => {
    const uuid = generateAssetUUID(networkChainId);
    expect(uuid).toEqual(ETHUUID);
  });

  it('generates a deterministic address uuid', () => {
    const uuid = generateDeterministicAddressUUID(networkId, testAddress);
    expect(uuid).toEqual(testAccountUuid);
  });
});
