import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeRight } from 'ramda';
import { select } from 'redux-saga-test-plan/matchers';
import { call, put, takeLatest } from 'redux-saga/effects';

import { Fiats } from '@config';
import { RatesService } from '@services/ApiService/Rates';
import { IPollingPayload, pollStart } from '@services/Polling';
import { IRates, LSKeys } from '@types';

import { getAccountsAssetsMappings } from './account.slice';
import { buildCoinGeckoIdMapping, destructureCoinGeckoIds } from './helpers';
import { getAppState } from './selectors';
import { getTrackedAssets } from './trackedAssets.slice';

export const initialState = {} as IRates;

const sliceName = LSKeys.RATES;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setRates(state, action: PayloadAction<IRates>) {
      return mergeRight(state, action.payload);
    }
  }
});

export const { setRates } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getRates = createSelector([getAppState], (s) => s[slice.name]);
export const getCoingeckoIdsMapping = createSelector(
  [getAccountsAssetsMappings, getTrackedAssets],
  (accountsAssets, trackedAssets) =>
    buildCoinGeckoIdMapping({ ...accountsAssets, ...trackedAssets })
);

/**
 * Actions
 */

export const startRatesPolling = createAction(`${slice.name}/startRatesPolling`);

/**
 * Sagas
 */

export function* ratesSaga() {
  yield takeLatest(startRatesPolling.type, pollRates);
}

export function* fetchRates() {
  const coinGeckoIdsMapping: Record<string, string> = yield select(getCoingeckoIdsMapping);

  const res: IRates = yield call(
    RatesService.fetchAssetsRates,
    [...new Set(Object.values(coinGeckoIdsMapping))],
    Object.keys(Fiats)
  );

  yield put(setRates(destructureCoinGeckoIds(res, coinGeckoIdsMapping)));
}

export function* pollRates() {
  const payload: IPollingPayload = {
    params: {
      interval: 90000,
      retryOnFailure: true,
      retries: 3,
      retryAfter: 3000
    },
    saga: fetchRates
  };

  yield put(pollStart(payload));
}
