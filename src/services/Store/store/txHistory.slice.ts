import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { HistoryService, ITxHistoryApiResponse } from '@services/ApiService/History';
import { StoreAccount } from '@types';

import {
  createAccount,
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { AppState } from './root.reducer';

export const initialState = {
  history: [] as ITxHistoryApiResponse[],
  error: false
};

const slice = createSlice({
  name: 'txHistory',
  initialState,
  reducers: {
    setHistory(state, action: PayloadAction<ITxHistoryApiResponse[]>) {
      state.history = action.payload;
    },
    fetchError(state) {
      state.error = true;
    }
  }
});

export const fetchHistory = createAction(`${slice.name}/fetchHistory`);

/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.txHistory,
  (s) => s
);
export const getTxHistory = createSelector([getSlice], (s) => s.history);
/**
 * Sagas
 */
export function* txHistorySaga() {
  yield all([
    takeLatest(
      [
        createAccount.type,
        createAccounts.type,
        resetAndCreateManyAccounts.type,
        destroyAccount.type
      ],
      fetchHistoryWorker
    ),
    takeLatest(fetchHistory.type, fetchHistoryWorker)
  ]);
}

export function* fetchHistoryWorker() {
  const accounts: StoreAccount[] = yield select(getAccounts);

  const filteredAccounts = accounts.filter((a) => a.networkId === 'Ethereum');

  if (filteredAccounts.length === 0) return;

  try {
    const history = yield call(
      HistoryService.instance.getHistory,
      filteredAccounts.map(({ address }) => address)
    );

    yield put(slice.actions.setHistory(history));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export const { setHistory } = slice.actions;

export default slice;
