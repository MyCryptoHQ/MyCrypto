import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { MyCryptoApiService } from '@services/ApiService';
import { HistoryService, ITxHistoryApiResponse } from '@services/ApiService/History';
import { ITxTypeMeta, StoreAccount, TxType } from '@types';

import {
  createAccount,
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { AppState } from './root.reducer';

export interface ITxMetaTypes {
  [s: string]: ITxTypeMeta;
}

export interface ITxHistoryState {
  history: ITxHistoryApiResponse[];
  txTypeMeta: ITxMetaTypes;
  error: string;
}

export const initialState = {
  history: [] as ITxHistoryApiResponse[],
  txTypeMeta: {} as ITxMetaTypes,
  error: false
};

const slice = createSlice({
  name: 'txHistory',
  initialState,
  reducers: {
    setHistory(state, action: PayloadAction<ITxHistoryApiResponse[]>) {
      state.history = action.payload;
    },
    setTxTypeMeta(state, action: PayloadAction<Record<TxType, ITxTypeMeta>>) {
      state.txTypeMeta = action.payload;
    },
    fetchError(state) {
      state.error = true;
    }
  }
});

export const fetchHistory = createAction(`${slice.name}/fetchHistory`);
export const fetchSchemaMeta = createAction(`${slice.name}/fetchSchemaMeta`);
/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.txHistory,
  (s) => s
);
export const getTxHistory = createSelector([getSlice], (s) => s.history);
export const getTxTypeMetas = createSelector([getSlice], (s) => s.txTypeMeta);
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
    takeLatest(fetchHistory.type, fetchHistoryWorker),
    takeLatest(fetchSchemaMeta.type, fetchTxTypeMetaWorker)
  ]);
}

export function* fetchHistoryWorker() {
  const accounts: StoreAccount[] = yield select(getAccounts);

  const filteredAccounts = accounts.filter((a) => a.networkId === 'Ethereum');

  if (filteredAccounts.length === 0) return;

  try {
    const history: ITxHistoryApiResponse[] = yield call(
      HistoryService.instance.getHistory,
      filteredAccounts.map(({ address }) => address)
    );

    yield put(slice.actions.setHistory(history));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export function* fetchTxTypeMetaWorker() {
  try {
    const txTypeMeta: ITxTypeMeta = yield call(MyCryptoApiService.instance.getSchemaMeta);

    yield put(slice.actions.setTxTypeMeta(txTypeMeta));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export const { setHistory, setTxTypeMeta } = slice.actions;

export default slice;
