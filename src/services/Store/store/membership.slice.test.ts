import { MembershipStatus } from '@features/PurchaseMembership/config';

import slice, { initialState } from './membership.slice';

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
