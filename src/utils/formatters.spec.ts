import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';

import {
  buildEIP681EtherRequest,
  buildEIP681TokenRequest,
  formatMnemonic,
  toChecksumAddressByChainId
} from './formatters';

const recipientAddress = '0xa766843bc7accfde54beb416ec8354d7ada5c643';
const alternativeChainID = 2;

describe('buildEIP681EtherRequest', () => {
  it('formats an EIP681 ETH request for a non-mainnet network', () => {
    const actual = buildEIP681EtherRequest(recipientAddress, alternativeChainID, '1.5');
    const expected = 'ethereum:0xa766843bc7accfde54beb416ec8354d7ada5c643@2?value=1.5e18';
    expect(actual).toEqual(expected);
  });

  it('formats an EIP681 ETH request for a mainnet network', () => {
    const actual = buildEIP681EtherRequest(recipientAddress, DEFAULT_NETWORK_CHAINID, '1.5');
    const expected = 'ethereum:0xa766843bc7accfde54beb416ec8354d7ada5c643?value=1.5e18';
    expect(actual).toEqual(expected);
  });
});

describe('buildEIP681TokenRequest', () => {
  it('formats an EIP681 token request for a non-mainnet network', () => {
    const actual = buildEIP681TokenRequest(
      recipientAddress,
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      alternativeChainID,
      '1.5',
      DEFAULT_ASSET_DECIMAL
    );
    const expected =
      'ethereum:0x6b175474e89094c44da98b954eedeac495271d0f@2/transfer?address=0xa766843bc7accfde54beb416ec8354d7ada5c643&uint256=1500000000000000000';
    expect(actual).toEqual(expected);
  });

  it('formats an EIP681 token request for a mainnet network', () => {
    const actual = buildEIP681TokenRequest(
      recipientAddress,
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      DEFAULT_NETWORK_CHAINID,
      '1.5',
      DEFAULT_ASSET_DECIMAL
    );
    const expected =
      'ethereum:0x6b175474e89094c44da98b954eedeac495271d0f/transfer?address=0xa766843bc7accfde54beb416ec8354d7ada5c643&uint256=1500000000000000000';
    expect(actual).toEqual(expected);
  });
});

describe('formatMnemonic', () => {
  const formattedPhrase =
    'first catalog away faculty jelly now life kingdom pigeon raise gain accident';

  it('should format phrases with new lines as a phrase with just spaces', () => {
    expect(
      formatMnemonic(
        'first\ncatalog\naway\nfaculty\njelly\nnow\nlife\nkingdom\npigeon\nraise\ngain\naccident'
      )
    ).toEqual(formattedPhrase);
  });

  it('should remove commas and replace with space characters', () => {
    expect(
      formatMnemonic('first,catalog,away,faculty,jelly,now,life,kingdom,pigeon,raise,gain,accident')
    ).toEqual(formattedPhrase);
  });

  it('should trim any stray space characters throughout the phrase', () => {
    expect(
      formatMnemonic(
        'first catalog   away faculty  jelly    now life kingdom pigeon raise gain accident      '
      )
    ).toEqual(formattedPhrase);
  });
});

describe('toChecksumAddressByChainId', () => {
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
      expect(toChecksumAddressByChainId(address, testParameters.chainId)).toBe(
        testParameters.expected
      );
    });
  });
});
