import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { expectSaga } from 'redux-saga-test-plan';
// eslint-disable-next-line import/no-namespace
import * as matchers from 'redux-saga-test-plan/matchers';

import { IMembershipId, MembershipStatus } from '@features/PurchaseMembership/config';
import { accountWithMembership, fNetworks, membershipApiResponse } from '@fixtures';
import { StoreAccount, TAddress } from '@types';
import { bigify } from '@utils';

import slice, {
  fetchMemberships,
  fetchMembershipsSaga,
  format,
  initialState
} from './membership.slice';

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
    { address: accountWithMembership },
    { address: '0xfeac75a09662396283f4bb50f0a9249576a81866' }
  ] as StoreAccount[];

  const initialState = {
    legacy: { accounts, networks: fNetworks }
  };

  it('formats timestamps', () => {
    const actual = format(membershipApiResponse);
    expect(actual).toEqual(res);
  });

  it('calls setMemberships on success', () => {
    return (
      expectSaga(fetchMembershipsSaga)
        .withState(initialState)
        .provide([[matchers.call.fn(getUnlockTimestamps), membershipApiResponse]])
        .put(setMemberships(res))
        .dispatch(fetchMemberships(accounts))
        // We test a `takeLatest` saga so we expect a timeout.
        // use `silentRun` to silence the warning.
        .silentRun()
    );
  });

  it('calls fetchError on error', () => {
    return expectSaga(fetchMembershipsSaga)
      .withState(initialState)
      .provide([matchers.call.fn(getUnlockTimestamps), {}])
      .dispatch(fetchMemberships(accounts))
      .put(fetchError())
      .silentRun();
  });
});
