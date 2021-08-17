import { ITxHash, TAddress } from '@types';

import { isSameAddress, isSameHash } from './isSameAddress';

describe('isSameAddress', () => {
  it('returns true for checksum version comparison', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520' as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeTruthy();
  });

  it('returns false if compared address is too short', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = '0x4bbeeb066e' as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeFalsy();
  });

  it('returns false if compared address is too long', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520bbbbbbbbbb' as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeFalsy();
  });

  it('returns false if either address is undefined', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = (undefined as unknown) as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeFalsy();
  });
});

describe('isSameHash', () => {
  it('returns true for checksum version comparison', () => {
    const hashOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa26152011111' as ITxHash;
    const hashTwo = '0x4bbeeb066ed09b7aed07bf39eee0460dfa26152011111' as ITxHash;
    expect(isSameHash(hashOne, hashTwo)).toBeTruthy();
  });
});
