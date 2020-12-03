import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { DEFAULT_NETWORK } from '@config';
import { IMembershipId, MembershipStatus } from '@features/PurchaseMembership/config';
import { accountWithMembership, fNetworks } from '@fixtures';
import { MembershipApi } from '@services/ApiService';
import { StoreAccount, WalletId } from '@types';
import { bigify } from '@utils';

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
    const m1 = { address: 'random' } as MembershipStatus;
    const m2 = { address: 'random2' } as MembershipStatus;
    const actual = reducer(initialState, setMemberships([m1, m2]));
    const expected = { ...initialState, record: [m1, m2] };
    expect(actual).toEqual(expected);
  });

  it('setMemberships(): deduplicates memberships', () => {
    const m1 = { address: 'random' } as MembershipStatus;
    const m2 = { address: 'random2' } as MembershipStatus;
    const actual = reducer({ ...initialState, record: [m1] }, setMemberships([m1, m2]));
    const expected = { ...initialState, record: [m1, m2] };
    expect(actual).toEqual(expected);
  });

  it('setMemberships(): deduplicates memberships uses mergeLeft', () => {
    const m1 = { address: 'random', memberships: [{ type: 'onemonth' }] } as MembershipStatus;
    const m2 = { address: 'random2' } as MembershipStatus;
    const actual = reducer(
      { ...initialState, record: [m1] },
      setMemberships([{ ...m1, memberships: [{ type: 'sixmonths' }] }, m2])
    );
    const expected = {
      ...initialState,
      record: [{ ...m1, memberships: [{ type: 'sixmonths' }] }, m2]
    };
    expect(actual).toEqual(expected);
  });

  it('setMembership(): add a membership state', () => {
    const entity = { address: 'random' } as MembershipStatus;
    const actual = reducer(initialState, setMembership(entity));
    const expected = { ...initialState, record: [entity] };
    expect(actual).toEqual(expected);
  });

  it('deleteMembership(): deletes an account with membership', () => {
    const a1 = { address: 'todestroy' } as MembershipStatus;
    const a2 = { address: 'tokeep' } as MembershipStatus;
    const state = [a1, a2];
    const actual = reducer({ ...initialState, record: state }, deleteMembership(a1.address));
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
  expectSaga.DEFAULT_TIMEOUT = 100;
  const res = [
    {
      address: accountWithMembership,
      memberships: [
        { expiry: bigify('1590743978'), type: 'onemonth' as IMembershipId },
        { expiry: bigify('1609372800'), type: 'lifetime' as IMembershipId }
      ]
    }
  ];

  const accounts = [
    { address: accountWithMembership, networkId: DEFAULT_NETWORK, wallet: WalletId.LEDGER_NANO_S },
    { address: '0xfeac75a09662396283f4bb50f0a9249576a81866' }
  ] as StoreAccount[];

  const initialState = {
    legacy: { accounts, networks: fNetworks }
  };

  it('can fetch memberships from provided accounts', () => {
    return (
      expectSaga(fetchMembershipsSaga)
        .withState(initialState)
        .provide([[call.fn(MembershipApi.getMemberships), res]])
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
      .put(setMemberships(res))
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
