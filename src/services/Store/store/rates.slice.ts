import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeRight } from 'ramda';
import { select } from 'redux-saga-test-plan/matchers';
import { put, takeLatest } from 'redux-saga/effects';

import { Fiats } from '@config';
import { RatesService } from '@services/ApiService/Rates';
import { IPollingPayload, pollStart } from '@services/Polling';
import { getAccountsAssets, updateAccountAssets } from '@store/account.slice';
import { ExtendedAsset, IRates, LSKeys } from '@types';

import { buildCoinGeckoIdArray, destructureCoinGeckoIds } from './helpers';
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
  yield takeLatest(updateAccountAssets, pollRates);
  yield takeLatest(trackAsset, pollRates);
  yield takeLatest(startRatesPolling, pollRates);
}

export function* pollRates() {
  const accountAssets: ExtendedAsset[] = yield select(getAccountsAssets);
  const trackedAssets: ExtendedAsset[] = yield select(getTrackedAssets);
  console.log(trackedAssets);
  const assets = [...accountAssets, ...trackedAssets];
  const coinGeckoIds = buildCoinGeckoIdArray(assets);

  const payload: IPollingPayload = {
    params: {
      interval: 9000
    },
    successAction: slice.actions.setRates,
    promise: async () => RatesService.instance.fetchAssetsRates(coinGeckoIds, Object.keys(Fiats)),
    transformer: (result: IRates) => destructureCoinGeckoIds(result, assets)
  };

  yield put(pollStart(payload));
}
