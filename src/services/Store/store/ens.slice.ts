import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { ENSService } from '@services/ApiService/Ens';
import { DomainNameRecord, StoreAccount } from '@types';

import {
  createAccount,
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { AppState } from './root.reducer';

export const initialState = {
  records: [] as DomainNameRecord[],
  fetched: false,
  error: false
};

const slice = createSlice({
  name: 'ens',
  initialState,
  reducers: {
    setRecords(state, action: PayloadAction<DomainNameRecord[]>) {
      state.records = action.payload;
      state.fetched = true;
    },
    fetchError(state) {
      state.error = true;
    }
  }
});

export const fetchENS = createAction(`${slice.name}/fetchENS`);

/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.ens,
  (s) => s
);
export const getENSRecords = createSelector([getSlice], (s) => s.records);
export const getENSFetched = createSelector([getSlice], (s) => s.fetched);

/**
 * Sagas
 */
export function* ensSaga() {
  yield all([
    takeLatest(
      [
        createAccount.type,
        createAccounts.type,
        resetAndCreateManyAccounts.type,
        destroyAccount.type
      ],
      fetchENSWorker
    ),
    takeLatest(fetchENS.type, fetchENSWorker)
  ]);
}

export function* fetchENSWorker() {
  const accounts: StoreAccount[] = yield select(getAccounts);

  const filteredAccounts = accounts.filter((a) => a.networkId === 'Ethereum');

  if (filteredAccounts.length === 0) {
    yield put(slice.actions.setRecords([]));
    return;
  }

  try {
    const records = yield call(ENSService.fetchOwnershipRecords, filteredAccounts);

    yield put(slice.actions.setRecords(records));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export const { setRecords } = slice.actions;

export default slice;
