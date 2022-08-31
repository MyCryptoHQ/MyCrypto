import { DEFAULT_NETWORK, POLYGON_NETWORK, XDAI_NETWORK } from '@config';
import { IMembershipId, MembershipStatus } from '@features/PurchaseMembership/config';
import {
  accountWithMembership,
  fAccount,
  fNetwork,
  fNetworks,
  membershipApiResponse
} from '@fixtures';
import { StoreAccount, WalletId } from '@types';

import MembershipApi, { formatResponse, getMembershipContracts } from './MembershipApi';

jest.mock('@mycrypto/unlock-scan', () => ({
  ...jest.requireActual('@mycrypto/unlock-scan'),
  getUnlockTimestamps: jest.fn().mockResolvedValue(Promise.reject('error fetching balances'))
}));

describe('MembershipApi', () => {
  it('formatResponse(): transforms timestamps to MembershipStatus', () => {
    const expected = [
      {
        address: accountWithMembership,
        memberships: [
          { expiry: '1590743978', type: 'onemonth' as IMembershipId },
          { expiry: '1609372800', type: 'lifetime' as IMembershipId }
        ],
        networkId: DEFAULT_NETWORK
      }
    ];
    const actual = formatResponse(DEFAULT_NETWORK)(membershipApiResponse);
    expect(actual).toEqual(expected);
  });
  it('getMultiNetworkMemberships(): handles fetch errors', async () => {
    const accounts = [
      {
        address: accountWithMembership,
        networkId: DEFAULT_NETWORK,
        wallet: WalletId.LEDGER_NANO_S
      },
      { address: '0xfeac75a09662396283f4bb50f0a9249576a81866', networkId: XDAI_NETWORK },
      { ...fAccount, networkId: POLYGON_NETWORK }
    ] as StoreAccount[];
    const polygonNetwork = { ...fNetwork, id: POLYGON_NETWORK };

    const ethereumAccounts = accounts
      .filter(({ networkId }) => networkId === DEFAULT_NETWORK)
      .map(({ address }) => address);
    const xdaiAccounts = accounts
      .filter(({ networkId }) => networkId === XDAI_NETWORK)
      .map(({ address }) => address);
    const polygonAccounts = accounts
      .filter(({ networkId }) => networkId === POLYGON_NETWORK)
      .map(({ address }) => address);

    const membershipFetchState = [
      {
        accounts: ethereumAccounts,
        network: fNetworks[0]
      },
      {
        accounts: xdaiAccounts,
        network: fNetworks[2]
      },
      {
        accounts: polygonAccounts,
        network: polygonNetwork
      }
    ];
    const memberships = [] as MembershipStatus[];
    const errors = {
      xDAI: true,
      MATIC: true,
      Ethereum: true
    };
    const expected = { memberships, errors };
    const res = await MembershipApi.getMultiNetworkMemberships(membershipFetchState);
    expect(res).toStrictEqual(expected);
  });
});

describe('getMembershipContracts()', () => {
  it('can getMembershipContracts for the xdai network', () => {
    const expected = [
      '0xcB3BB4CCe15b492E7fdD7cb9a3835C034714207A',
      '0xf97f516Cc0700a4Ce9Ee64D488F744f631e1525d',
      '0xEB24302c4c78963e1b348b274aa9cC6fcbe80527'
    ];
    expect(getMembershipContracts(XDAI_NETWORK)).toStrictEqual(expected);
  });

  it('can getMembershipContracts for the ethereum network', () => {
    const expected = [
      '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf',
      '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125',
      '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329',
      '0xee2B7864d8bc731389562F820148e372F57571D8',
      '0x098D8b363933D742476DDd594c4A5a5F1a62326a'
    ];
    expect(getMembershipContracts(DEFAULT_NETWORK)).toStrictEqual(expected);
  });
});
