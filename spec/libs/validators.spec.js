import {
  isValidBTCAddress,
  isValidETHAddress
} from '../../common/libs/validators';
import { DONATION_ADDRESSES_MAP } from '../../common/config/data';

describe('Validator', () => {
  it('should validate correct BTC address as true', () => {
    expect(isValidBTCAddress(DONATION_ADDRESSES_MAP.BTC)).toBeTruthy();
  });
  it('should validate incorrect BTC address as false', () => {
    expect(
      isValidBTCAddress('nonsense' + DONATION_ADDRESSES_MAP.BTC + 'nonsense')
    ).toBeFalsy();
  });

  it('should validate correct ETH address as true', () => {
    expect(isValidETHAddress(DONATION_ADDRESSES_MAP.ETH)).toBeTruthy();
  });
  it('should validate incorrect ETH address as false', () => {
    expect(
      isValidETHAddress('nonsense' + DONATION_ADDRESSES_MAP.ETH + 'nonsense')
    ).toBeFalsy();
  });
});
