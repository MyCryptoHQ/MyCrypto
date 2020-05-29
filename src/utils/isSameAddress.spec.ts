import { TAddress } from '@types';

import { isSameAddress } from './isSameAddress';

describe('isSameAddress', () => {
  it('returns true for checksum version comparison', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = '0x4bbeeb066ed09b7aed07bf39eee0460dfa261520' as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeTruthy();
  });

  it('returns false if compared address is too short or too long', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = '0x4bbeeb066e' as TAddress;
    const addressThree = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520bbbbbbbbbb' as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeFalsy();

    expect(isSameAddress(addressOne, addressThree)).toBeFalsy();
  });

  it('returns false if either address is undefined', () => {
    const addressOne = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const addressTwo = (undefined as unknown) as TAddress;
    expect(isSameAddress(addressOne, addressTwo)).toBeFalsy();
  });
});
