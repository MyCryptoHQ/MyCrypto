import {
  isValidBTCAddress,
  isValidETHAddress,
  isValidPath,
  isValidPrivKey
} from '../../common/libs/validators';
import { DPaths } from 'config/dpaths';
import { valid, invalid } from '../utils/testStrings';

const VALID_BTC_ADDRESS = '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6';
const VALID_ETH_ADDRESS = '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8';
const VALID_ETH_PRIVATE_KEY = '3f4fd89ea4970cc77bfd2d07a95786575ea62e183857afe6301578e1a3c5c782';
const INVALID_ETH_PRIVATE_KEY = '3f4fd89ea4970cc77bfd2d07a95786575ea62e183857afe6301578e1a3c5ZZZZ';
const VALID_ETH_PRIVATE_BUFFER = Buffer.from(VALID_ETH_PRIVATE_KEY, 'hex');
const VALID_ETH_PRIVATE_0X = '0x3f4fd89ea4970cc77bfd2d07a95786575ea62e183857afe6301578e1a3c5c782';

describe('Validator', () => {
  it('should validate correct BTC address as true', () => {
    expect(isValidBTCAddress(VALID_BTC_ADDRESS)).toBeTruthy();
  });
  it('should validate incorrect BTC address as false', () => {
    expect(isValidBTCAddress('nonsense' + VALID_BTC_ADDRESS + 'nonsense')).toBeFalsy();
  });

  it('should validate correct ETH address as true', () => {
    expect(isValidETHAddress(VALID_ETH_ADDRESS)).toBeTruthy();
  });
  it('should validate incorrect ETH address as false', () => {
    expect(isValidETHAddress('nonsense' + VALID_ETH_ADDRESS + 'nonsense')).toBeFalsy();
  });
  it('should validate an incorrect DPath as false', () => {
    expect(isValidPath('m/44/60/0/0')).toBeFalsy();
  });
  it('should validate private key as true', () => {
    expect(isValidPrivKey(VALID_ETH_PRIVATE_KEY)).toBeTruthy();
  });
  it('should validate invalid private key as false', () => {
    expect(isValidPrivKey(INVALID_ETH_PRIVATE_KEY)).toBeFalsy();
  });
  it('should validate 0x private keys as true', () => {
    expect(isValidPrivKey(VALID_ETH_PRIVATE_0X)).toBeTruthy();
  });
  it('should validate private key buffer type as true', () => {
    expect(isValidPrivKey(VALID_ETH_PRIVATE_BUFFER)).toBeTruthy();
  });
});

describe('Validator', () => {
  it('should validate correct DPaths as true', () => {
    valid.forEach(path => {
      expect(isValidPath(path)).toBeTruthy();
    });
  });
  it('should validate incorrect DPaths as false', () => {
    invalid.forEach(path => {
      expect(isValidPath(path)).toBeFalsy();
    });
  });
  it('should validate hardcoded DPaths as true', () => {
    DPaths.forEach(DPath => {
      expect(isValidPath(DPath.value)).toBeTruthy();
    });
  });
});
