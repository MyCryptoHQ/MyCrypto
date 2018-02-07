import { fetchCCRatesSucceeded, fetchCCRatesFailed, FetchCCRatesRequested } from 'actions/rates';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRates, CCResponse } from 'api/rates';
import { TypeKeys } from 'actions/rates/constants';

export function* fetchRatesSaga(action: FetchCCRatesRequested): SagaIterator {
  try {
    const rates: CCResponse = yield call(fetchRates, action.payload);
    yield put(fetchCCRatesSucceeded(rates));
  } catch (e) {
    yield put(fetchCCRatesFailed());
    return;
  }
}

export default function* ratesSaga(): SagaIterator {
  yield takeLatest(TypeKeys.RATES_FETCH_CC_REQUESTED, fetchRatesSaga);
}
