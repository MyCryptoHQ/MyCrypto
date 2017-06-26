import Validator from '../../common/libs/validator';
import { DONATION_ADDRESSES_MAP } from '../../common/config/data';

describe('Validator', () => {
  it('should validate correct BTC address as true', () => {
    const validator = new Validator();
    expect(
      validator.isValidBTCAddress(DONATION_ADDRESSES_MAP.BTC)
    ).toBeTruthy();
  });
  it('should validate incorrect BTC address as false', () => {
    const validator = new Validator();
    expect(
      validator.isValidBTCAddress(
        'nonsense' + DONATION_ADDRESSES_MAP.BTC + 'nonsense'
      )
    ).toBeFalsy();
  });

  it('should validate correct ETH address as true', () => {
    const validator = new Validator();
    expect(
      validator.isValidETHAddress(DONATION_ADDRESSES_MAP.ETH)
    ).toBeTruthy();
  });
  it('should validate incorrect ETH address as false', () => {
    const validator = new Validator();
    expect(
      validator.isValidETHAddress(
        'nonsense' + DONATION_ADDRESSES_MAP.ETH + 'nonsense'
      )
    ).toBeFalsy();
  });
});
