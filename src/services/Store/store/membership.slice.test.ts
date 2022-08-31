import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { DEFAULT_NETWORK, POLYGON_NETWORK, XDAI_NETWORK } from '@config';
import { MembershipStatus } from '@features/PurchaseMembership/config';
import { accountWithMembership, fAccount, fNetwork, fNetworks } from '@fixtures';
import { MembershipApi } from '@services/ApiService';
import { StoreAccount, WalletId } from '@types';

import slice, {
  fetchMemberships,
  fetchMembershipsSaga,
  initialState,
  MembershipErrorState,
  setMembershipFetchState
} from './membership.slice';

const reducer = slice.reducer;
const { setMembership, deleteMembership } = slice.actions;

describe('MembershipsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setMembershipFetchState(): adds multiple memberships state', () => {
    const m1 = { address: 'random', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const m2 = { address: 'random2', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer(
      initialState,
      setMembershipFetchState({ memberships: [m1, m2], errors: {} as MembershipErrorState })
    );
    const expected = { ...initialState, record: [m1, m2] };
    expect(actual).toEqual(expected);
  });

  it('setMembershipFetchState(): deduplicates memberships', () => {
    const m1 = { address: 'random', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const m2 = { address: 'random2', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer(
      { ...initialState, record: [m1] },
      setMembershipFetchState({ memberships: [m1, m2], errors: {} as MembershipErrorState })
    );
    const expected = { ...initialState, record: [m1, m2] };
    expect(actual).toEqual(expected);
  });

  it('setMembershipFetchState(): deduplicates memberships uses mergeLeft', () => {
    const m1 = {
      address: 'random',
      memberships: [{ type: 'onemonth' }],
      networkId: DEFAULT_NETWORK
    } as MembershipStatus;
    const m2 = { address: 'random2', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer(
      { ...initialState, record: [m1] },
      setMembershipFetchState({
        memberships: [{ ...m1, memberships: [{ type: 'sixmonths' }] }, m2] as MembershipStatus[],
        errors: {} as MembershipErrorState
      })
    );
    const expected = {
      ...initialState,
      record: [{ ...m1, memberships: [{ type: 'sixmonths' }] }, m2]
    };
    expect(actual).toEqual(expected);
  });

  it('setMembership(): add a membership state', () => {
    const entity = { address: 'random', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer(initialState, setMembership(entity));
    const expected = { ...initialState, record: [entity] };
    expect(actual).toEqual(expected);
  });

  it('deleteMembership(): deletes an account with membership', () => {
    const a1 = { address: 'todestroy', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const a2 = { address: 'tokeep', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const state = [a1, a2];
    const actual = reducer(
      { ...initialState, record: state },
      deleteMembership({ address: a1.address, networkId: a1.networkId })
    );
    const expected = { ...initialState, record: [a2] };
    expect(actual).toEqual(expected);
  });

  it('setMembershipFetchState(): sets an error', () => {
    const errorState = {
      Ethereum: false,
      xDAI: true,
      MATIC: false
    };
    const actual = reducer(
      initialState,
      setMembershipFetchState({ memberships: [], errors: errorState })
    );
    const expected = { ...initialState, error: errorState };
    expect(actual).toEqual(expected);
  });
});

describe('fetchMembershipsSaga()', () => {
  const res = [
    {
      address: '0xfeac75a09662396283f4bb50f0a9249576a81866',
      memberships: [
        { expiry: '1590743978', type: 'onemonth' },
        { expiry: '1609372800', type: 'lifetime' }
      ],
      networkId: XDAI_NETWORK
    } as MembershipStatus,
    {
      address: accountWithMembership,
      memberships: [
        { expiry: '1590743978', type: 'onemonth' },
        { expiry: '1609372800', type: 'lifetime' }
      ],
      networkId: DEFAULT_NETWORK
    } as MembershipStatus,
    {
      address: fAccount.address,
      memberships: [
        { expiry: '1590743978', type: 'onemonth' },
        { expiry: '1609372800', type: 'lifetime' }
      ],
      networkId: POLYGON_NETWORK
    } as MembershipStatus
  ];

  const accounts = [
    { address: accountWithMembership, networkId: DEFAULT_NETWORK, wallet: WalletId.LEDGER_NANO_S },
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

  const membershipFetchExpected = {
    memberships: res,
    errors: {} as MembershipErrorState
  };

  const initialState = mockAppState({ accounts, networks: [...fNetworks, polygonNetwork] });

  it('can fetch memberships from provided accounts', () => {
    return (
      expectSaga(fetchMembershipsSaga)
        .withState(initialState)
        .provide([
          [
            call(MembershipApi.getMultiNetworkMemberships, membershipFetchState),
            membershipFetchExpected
          ]
        ])
        .put(setMembershipFetchState({ memberships: res, errors: {} as MembershipErrorState }))
        .dispatch(fetchMemberships(accounts))
        // We test a `takeLatest` saga so we expect a timeout.
        // use `silentRun` to silence the warning.
        .silentRun()
    );
  });

  it('can fetch memberships from state', () => {
    return expectSaga(fetchMembershipsSaga)
      .withState(initialState)
      .provide([
        [
          call(MembershipApi.getMultiNetworkMemberships, membershipFetchState),
          membershipFetchExpected
        ]
      ])
      .put(setMembershipFetchState({ memberships: res, errors: {} as MembershipErrorState }))
      .dispatch(fetchMemberships())
      .silentRun();
  });

  it('can sets error if the call throws an error', () => {
    return expectSaga(fetchMembershipsSaga)
      .withState(initialState)
      .provide([
        [
          call(MembershipApi.getMultiNetworkMemberships, membershipFetchState),
          {
            memberships: membershipFetchExpected.memberships,
            errors: { Ethereum: true }
          }
        ]
      ])
      .put(
        setMembershipFetchState({
          memberships: res,
          errors: { Ethereum: true } as MembershipErrorState
        })
      )
      .dispatch(fetchMemberships())
      .silentRun();
  });
});
