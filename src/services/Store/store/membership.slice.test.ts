import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga, mockAppState } from 'test-utils';

import { DEFAULT_NETWORK, XDAI_NETWORK } from '@config';
import { MembershipStatus } from '@features/PurchaseMembership/config';
import { accountWithMembership, fNetworks } from '@fixtures';
import { MembershipApi } from '@services/ApiService';
import { StoreAccount, WalletId } from '@types';

import slice, { fetchMemberships, fetchMembershipsSaga, initialState } from './membership.slice';

const reducer = slice.reducer;
const { setMemberships, setMembership, deleteMembership, fetchError } = slice.actions;

describe('MembershipsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setMemberships(): adds multiple memberships state', () => {
    const m1 = { address: 'random', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const m2 = { address: 'random2', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer(initialState, setMemberships([m1, m2]));
    const expected = { ...initialState, record: [m1, m2] };
    expect(actual).toEqual(expected);
  });

  it('setMemberships(): deduplicates memberships', () => {
    const m1 = { address: 'random', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const m2 = { address: 'random2', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer({ ...initialState, record: [m1] }, setMemberships([m1, m2]));
    const expected = { ...initialState, record: [m1, m2] };
    expect(actual).toEqual(expected);
  });

  it('setMemberships(): deduplicates memberships uses mergeLeft', () => {
    const m1 = {
      address: 'random',
      memberships: [{ type: 'onemonth' }],
      networkId: DEFAULT_NETWORK
    } as MembershipStatus;
    const m2 = { address: 'random2', networkId: DEFAULT_NETWORK } as MembershipStatus;
    const actual = reducer(
      { ...initialState, record: [m1] },
      setMemberships([{ ...m1, memberships: [{ type: 'sixmonths' }] }, m2] as MembershipStatus[])
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

  it('fetchError(): sets an error', () => {
    const actual = reducer(initialState, fetchError());
    const expected = { ...initialState, error: true };
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
    } as MembershipStatus
  ];

  const accounts = [
    { address: accountWithMembership, networkId: DEFAULT_NETWORK, wallet: WalletId.LEDGER_NANO_S },
    { address: '0xfeac75a09662396283f4bb50f0a9249576a81866', networkId: XDAI_NETWORK }
  ] as StoreAccount[];

  const initialState = mockAppState({ accounts, networks: fNetworks });

  it('can fetch memberships from provided accounts', () => {
    const ethereumAccounts = accounts
      .filter(({ networkId }) => networkId === DEFAULT_NETWORK)
      .map(({ address }) => address);
    const xdaiAccounts = accounts
      .filter(({ networkId }) => networkId === XDAI_NETWORK)
      .map(({ address }) => address);
    return (
      expectSaga(fetchMembershipsSaga)
        .withState(initialState)
        .provide([
          [call(MembershipApi.getMemberships, xdaiAccounts, fNetworks[2]), [res[1]]],
          [call(MembershipApi.getMemberships, ethereumAccounts, fNetworks[0]), [res[0]]]
        ])
        .put(setMemberships(res))
        .dispatch(fetchMemberships(accounts))
        // We test a `takeLatest` saga so we expect a timeout.
        // use `silentRun` to silence the warning.
        .silentRun()
    );
  });

  it('can fetch memberships from state', () => {
    return expectSaga(fetchMembershipsSaga)
      .withState(initialState)
      .provide([[call.fn(MembershipApi.getMemberships), res]])
      .put(setMemberships([...res, ...res]))
      .dispatch(fetchMemberships())
      .silentRun();
  });

  it('can sets error if the call fails', () => {
    const error = new Error('error');
    return expectSaga(fetchMembershipsSaga)
      .withState(initialState)
      .provide([[call.fn(MembershipApi.getMemberships), throwError(error)]])
      .put(fetchError())
      .dispatch(fetchMemberships())
      .silentRun();
  });
});
