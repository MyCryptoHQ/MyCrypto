import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeRight } from 'ramda';
import { select } from 'redux-saga-test-plan/matchers';
import { all, put, takeLatest } from 'redux-saga/effects';

import { Fiats } from '@config';
import { RatesService } from '@services/ApiService/Rates';
import { IPollingPayload, pollStart } from '@services/Polling';
import { ExtendedAsset, IRates, LSKeys } from '@types';

import { getAccountsAssets, updateAccountAssets } from './account.slice';
import { buildCoinGeckoIdMapping, destructureCoinGeckoIds } from './helpers';
import { getAppState } from './selectors';
import { getTrackedAssets, trackAsset } from './trackedAssets.slice';

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

/**
 * Actions
 */

export const startRatesPolling = createAction(`${slice.name}/startRatesPolling`);

/**
 * Sagas
 */

export function* ratesSaga() {
  yield all([
    yield takeLatest(updateAccountAssets.type, pollRates),
    yield takeLatest(trackAsset.type, pollRates),
    yield takeLatest(startRatesPolling.type, pollRates)
  ]);
}

export function* pollRates() {
  const accountAssets: ExtendedAsset[] = yield select(getAccountsAssets);
  const trackedAssets: ExtendedAsset[] = yield select(getTrackedAssets);

  const assets = [...accountAssets, ...trackedAssets];
  const coinGeckoIdsMapping = buildCoinGeckoIdMapping(assets);

  const payload: IPollingPayload = {
    params: {
      interval: 9000,
      retryOnFailure: true,
      retries: 3,
      retryAfter: 3000
    },
    successAction: slice.actions.setRates,
    promise: async () =>
      RatesService.instance.fetchAssetsRates(
        [...new Set(Object.values(coinGeckoIdsMapping))],
        Object.keys(Fiats)
      ),
    transformer: (result: IRates) => destructureCoinGeckoIds(result, coinGeckoIdsMapping)
  };

  yield put(pollStart(payload));
}
