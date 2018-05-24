import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchRates, CCResponse } from 'api/rates';
import { RATES_FETCH, FetchCCRatesRequested } from './types';
import { fetchCCRatesSucceeded, fetchCCRatesFailed } from './actions';

export function* fetchRatesSaga(action: FetchCCRatesRequested): SagaIterator {
  try {
    const rates: CCResponse = yield call(fetchRates, action.payload);
    yield put(fetchCCRatesSucceeded(rates));
  } catch (e) {
    console.error('Failed to fetch rates:', e);
    yield put(fetchCCRatesFailed());
    return;
  }
}

export function* ratesSaga(): SagaIterator {
  yield takeLatest(RATES_FETCH.CC_REQUESTED, fetchRatesSaga);
}
