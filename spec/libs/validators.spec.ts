import { DPaths } from 'config/dpaths';
import { valid, invalid } from '../utils/testStrings';
import {
  isValidBTCAddress,
  isValidETHAddress,
  isValidPath,
  isValidPrivKey,
  isValidAddress
} from 'v2/services/EthService/validators';

const VALID_BTC_ADDRESS = '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6';
const VALID_ETH_ADDRESS = '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8';
const VALID_RSK_TESTNET_ADDRESS = '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd';
const VALID_RSK_MAINNET_ADDRESS = '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD';
const VALID_ETH_PRIVATE_KEY = '3f4fd89ea4970cc77bfd2d07a95786575ea62e183857afe6301578e1a3c5c782';
const INVALID_ETH_PRIVATE_KEY = '3f4fd89ea4970cc77bfd2d07a95786575ea62e183857afe6301578e1a3c5ZZZZ';
const VALID_ETH_PRIVATE_BUFFER = Buffer.from(VALID_ETH_PRIVATE_KEY, 'hex');
const VALID_ETH_PRIVATE_0X = '0x3f4fd89ea4970cc77bfd2d07a95786575ea62e183857afe6301578e1a3c5c782';
const RSK_TESTNET_CHAIN_ID = 31;
const RSK_MAINNET_CHAIN_ID = 30;
const ETH_CHAIN_ID = 1;
const BIP49_DPATH = "m/49'/0'/0'";

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
  it('should validate correct ETH address in RSK network as false', () => {
    expect(isValidAddress(VALID_ETH_ADDRESS, RSK_TESTNET_CHAIN_ID)).toBeFalsy();
  });
  it('should validate correct RSK address in ETH network as false', () => {
    expect(isValidAddress(VALID_RSK_TESTNET_ADDRESS, ETH_CHAIN_ID)).toBeFalsy();
  });
  it('should validate correct RSK address in RSK testnet network as true', () => {
    expect(isValidAddress(VALID_RSK_TESTNET_ADDRESS, RSK_TESTNET_CHAIN_ID)).toBeTruthy();
  });
  it('should validate correct RSK address in RSK mainnet network as false', () => {
    expect(isValidAddress(VALID_RSK_TESTNET_ADDRESS, RSK_MAINNET_CHAIN_ID)).toBeFalsy();
  });
  it('should validate correct RSK address in RSK mainnet network as true', () => {
    expect(isValidAddress(VALID_RSK_MAINNET_ADDRESS, RSK_MAINNET_CHAIN_ID)).toBeTruthy();
  });
  it('should validate correct RSK mainnet address in RSK testnet network as false', () => {
    expect(isValidAddress(VALID_RSK_MAINNET_ADDRESS, RSK_TESTNET_CHAIN_ID)).toBeFalsy();
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
  it('should validate BIP49 DPaths as true', () => {
    expect(isValidPath(BIP49_DPATH)).toBeTruthy();
  });
});
