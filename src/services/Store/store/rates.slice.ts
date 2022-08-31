import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeRight } from 'ramda';
import { select } from 'redux-saga-test-plan/matchers';
import { all, call, put } from 'redux-saga/effects';

import { Fiats } from '@config';
import { RatesService } from '@services/ApiService/Rates';
import { IPollingPayload, pollingSaga } from '@services/Polling';
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

export const startRatesPolling = createAction(`${slice.name}/startPolling`);
export const stopRatesPolling = createAction(`${slice.name}/stopPolling`);

/**
 * Sagas
 */

const payload: IPollingPayload = {
  startAction: startRatesPolling,
  stopAction: stopRatesPolling,
  params: {
    interval: 90000,
    retryOnFailure: true,
    retries: 3,
    retryAfter: 3000
  },
  saga: fetchRates
};

export function* ratesSaga() {
  yield all([pollingSaga(payload)]);
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
