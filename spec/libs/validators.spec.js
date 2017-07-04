import {
  isValidBTCAddress,
  isValidETHAddress
} from '../../common/libs/validators';
import { donationAddressMap } from '../../common/config/data';

describe('Validator', () => {
  it('should validate correct BTC address as true', () => {
    expect(isValidBTCAddress(donationAddressMap.BTC)).toBeTruthy();
  });
  it('should validate incorrect BTC address as false', () => {
    expect(
      isValidBTCAddress('nonsense' + donationAddressMap.BTC + 'nonsense')
    ).toBeFalsy();
  });

  it('should validate correct ETH address as true', () => {
    expect(isValidETHAddress(donationAddressMap.ETH)).toBeTruthy();
  });
  it('should validate incorrect ETH address as false', () => {
    expect(
      isValidETHAddress('nonsense' + donationAddressMap.ETH + 'nonsense')
    ).toBeFalsy();
  });
});
