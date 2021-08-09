import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga, mockAppState } from 'test-utils';

import { fAccounts, fNetworks } from '@fixtures';
import { ClaimsService } from '@services/ApiService';
import { ClaimState, ClaimType, ITxValue, TAddress } from '@types';

import slice, { claimsSaga, fetchClaims, initialState } from './claims.slice';

const reducer = slice.reducer;
const { fetchError, setClaims } = slice.actions;

describe('ClaimsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setClaims(): sets claims', () => {
    const claims = [
      {
        address: fAccounts[0].address as TAddress,
        state: ClaimState.UNCLAIMED,
        amount: '403' as ITxValue
      }
    ];
    const actual = reducer(initialState, setClaims({ type: ClaimType.UNI, claims }));
    const expected = { ...initialState, claims: { [ClaimType.UNI]: claims } };
    expect(actual).toEqual(expected);
  });

  it('fetchError(): sets an error', () => {
    const actual = reducer(initialState, fetchError());
    const expected = { ...initialState, error: true };
    expect(actual).toEqual(expected);
  });
});

describe('claimsSaga()', () => {
  it('fetches UNI claims', () => {
    const accounts = [fAccounts[0]];
    const claims = [
      {
        address: fAccounts[0].address,
        state: ClaimState.UNCLAIMED,
        amount: '0x15AF1D78B58C400000' as ITxValue
      }
    ];
    return expectSaga(claimsSaga)
      .withState(
        mockAppState({
          accounts,
          networks: fNetworks
        })
      )
      .provide([
        [call.fn(ClaimsService.instance.getClaims), []],
        [call.fn(ClaimsService.instance.isClaimed), claims]
      ])
      .put(setClaims({ type: ClaimType.UNI, claims }))
      .dispatch(fetchClaims())
      .silentRun();
  });

  it('can sets error if the call fails', () => {
    const error = new Error('error');
    return expectSaga(claimsSaga)
      .withState(mockAppState({ accounts: fAccounts, networks: fNetworks }))
      .provide([[call.fn(ClaimsService.instance.getClaims), throwError(error)]])
      .put(fetchError())
      .dispatch(fetchClaims())
      .silentRun();
  });
});
