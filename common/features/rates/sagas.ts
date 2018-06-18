import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchRates, CCResponse } from 'api/rates';
import * as types from './types';
import * as actions from './actions';

export function* fetchRatesSaga(action: types.FetchCCRatesRequested): SagaIterator {
  try {
    const rates: CCResponse = yield call(fetchRates, action.payload);
    yield put(actions.fetchCCRatesSucceeded(rates));
  } catch (e) {
    console.error('Failed to fetch rates:', e);
    yield put(actions.fetchCCRatesFailed());
    return;
  }
}

export function* ratesSaga(): SagaIterator {
  yield takeLatest(types.RatesActions.CC_REQUESTED, fetchRatesSaga);
}
