import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga, mockAppState } from 'test-utils';

import { fAccounts, fEnsRecords, fEnsApiResponse as mockEnsResponse } from '@fixtures';
import { ENSService } from '@services/ApiService/Ens';
import { TAddress } from '@types';

import slice, { ensSaga, fetchENS, initialState } from './ens.slice';

const reducer = slice.reducer;
const { fetchError, setRecords } = slice.actions;

jest.mock('apollo-boost', () => ({
  ...jest.requireActual('apollo-boost'),
  default: jest.fn().mockImplementation(() => ({
    query: jest.fn().mockImplementation(() => Promise.resolve(mockEnsResponse))
  }))
}));

describe('EnsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setRecords(): sets record array', () => {
    const actual = reducer(initialState, setRecords(fEnsRecords));
    const expected = { ...initialState, fetched: true, records: fEnsRecords };
    expect(actual).toEqual(expected);
  });

  it('fetchError(): sets an error', () => {
    const actual = reducer(initialState, fetchError());
    const expected = { ...initialState, error: true };
    expect(actual).toEqual(expected);
  });
});

describe('ensSaga()', () => {
  it('fetches ens', () => {
    return expectSaga(ensSaga)
      .withState(
        mockAppState({
          accounts: [
            {
              ...fAccounts[0],
              address: fEnsRecords[0].owner as TAddress
            }
          ]
        })
      )
      .put(setRecords(fEnsRecords))
      .dispatch(fetchENS())
      .silentRun();
  });

  it('can sets error if the call fails', () => {
    const error = new Error('error');
    return expectSaga(ensSaga)
      .withState(mockAppState({ accounts: fAccounts }))
      .provide([[call.fn(ENSService.fetchOwnershipRecords), throwError(error)]])
      .put(fetchError())
      .dispatch(fetchENS())
      .silentRun();
  });
});
