import {
  isValidBTCAddress,
  isValidETHAddress,
  isValidPath
} from '../../common/libs/validators';

const VALID_BTC_ADDRESS = '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6';
const VALID_ETH_ADDRESS = '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8';

describe('Validator', () => {
  it('should validate correct BTC address as true', () => {
    expect(isValidBTCAddress(VALID_BTC_ADDRESS)).toBeTruthy();
  });
  it('should validate incorrect BTC address as false', () => {
    expect(
      isValidBTCAddress('nonsense' + VALID_BTC_ADDRESS + 'nonsense')
    ).toBeFalsy();
  });

  it('should validate correct ETH address as true', () => {
    expect(isValidETHAddress(VALID_ETH_ADDRESS)).toBeTruthy();
  });
  it('should validate incorrect ETH address as false', () => {
    expect(
      isValidETHAddress('nonsense' + VALID_ETH_ADDRESS + 'nonsense')
    ).toBeFalsy();
  });

  it('should validate a correct DPath as true', () => {
    expect(isValidPath("m/44'/60'/0'/0")).toBeTruthy();
  });
  it('should validate an incorrect DPath as false', () => {
    expect(isValidPath('m/44/60/0/0')).toBeFalsy();
  });
});
