import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchRates, CCResponse } from 'api/rates';
import * as ratesTypes from './types';
import * as ratesActions from './actions';

export function* fetchRatesSaga(action: ratesTypes.FetchCCRatesRequested): SagaIterator {
  try {
    const rates: CCResponse = yield call(fetchRates, action.payload);
    yield put(ratesActions.fetchCCRatesSucceeded(rates));
  } catch (e) {
    console.error('Failed to fetch rates:', e);
    yield put(ratesActions.fetchCCRatesFailed());
    return;
  }
}

export function* ratesSaga(): SagaIterator {
  yield takeLatest(ratesTypes.RatesActions.CC_REQUESTED, fetchRatesSaga);
}
