import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { expectSaga } from 'redux-saga-test-plan';
// eslint-disable-next-line import/no-namespace
import * as matchers from 'redux-saga-test-plan/matchers';
import { select } from 'redux-saga/effects';

import { MembershipStatus } from '@features/PurchaseMembership/config';
import { fNetworks } from '@fixtures';
import { StoreAccount, TAddress } from '@types';

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

describe('membershipRootSaga()', () => {
  // eslint-disable-next-line jest/expect-expect
  it('calls setMemberships on success', () => {
    const res = [
      {
        address: '0x82d69476357a03415e92b5780c89e5e9e972ce75' as TAddress,
        memberships: [
          {
            type: 'onemonth',
            expiry: {
              _hex: '0x5ed0d3aa',
              _isBigNumber: true
            }
          },
          {
            type: 'lifetime',
            expiry: {
              _hex: '0x5fed1480',
              _isBigNumber: true
            }
          }
        ]
      }
    ];

    const apiRes = {
      '0x82d69476357a03415e92b5780c89e5e9e972ce75': {
        '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf': {
          _hex: '0x5ed0d3aa',
          _isBigNumber: true
        },
        '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0xee2B7864d8bc731389562F820148e372F57571D8': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0x098D8b363933D742476DDd594c4A5a5F1a62326a': {
          _hex: '0x5fed1480',
          _isBigNumber: true
        }
      },
      '0xfeac75a09662396283f4bb50f0a9249576a81866': {
        '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0xee2B7864d8bc731389562F820148e372F57571D8': {
          _hex: '0x00',
          _isBigNumber: true
        },
        '0x098D8b363933D742476DDd594c4A5a5F1a62326a': {
          _hex: '0x00',
          _isBigNumber: true
        }
      }
    };

    const accounts = [
      { address: '0x82d69476357a03415e92b5780c89e5e9e972ce75' } as StoreAccount,
      { address: '0xfeac75a09662396283f4bb50f0a9249576a81866' } as StoreAccount
    ];

    return expectSaga(fetchMembershipsSaga, fetchMemberships(accounts))
      .withState({ legacy: { accounts, networks: fNetworks } })
      .provide([[matchers.call.fn(getUnlockTimestamps), apiRes]])
      .put(setMemberships(res))
      .run();
  });

  // it('calls fetchError on error', () => {
  //   return expectSaga(fetchMemberships)
  //     .provide([matchers.call.fn(getUnlockTimestamps), {}])
  //     .put(fetchError())
  //     .run();
  // });
});
