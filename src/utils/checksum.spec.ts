import { DEFAULT_NETWORK_CHAINID } from '@config';

import { toChecksumAddress } from './checksum';

describe('toChecksumAddress', () => {
  const address = '0xa766843bc7accfde54beb416ec8354d7ada5c643';
  const RSK_TESTNET_CHAIN_ID = 31;
  const RSK_MAINNET_CHAIN_ID = 30;
  const tests = [
    {
      chainId: RSK_MAINNET_CHAIN_ID,
      expected: '0xA766843bC7AcCfdE54beB416EC8354D7ada5C643'
    },
    {
      chainId: RSK_TESTNET_CHAIN_ID,
      expected: '0xA766843bC7acCfde54Beb416EC8354D7Ada5C643'
    },
    {
      chainId: DEFAULT_NETWORK_CHAINID,
      expected: '0xa766843bc7AcCfdE54beb416ec8354D7ADa5C643'
    }
  ];
  tests.map((testParameters) => {
    it(`should properly handle chainId ${testParameters.chainId}`, () => {
      expect(toChecksumAddress(address, testParameters.chainId)).toBe(testParameters.expected);
    });
  });
});
