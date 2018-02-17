import { setGasEstimates, TypeKeys } from 'actions/gas';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { AppState } from 'reducers';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import { gasPriceDefaults, gasEstimateCacheTime } from 'config';
import { getEstimates } from 'selectors/gas';
import { getOffline } from 'selectors/config';

export function* setDefaultEstimates(): SagaIterator {
  // Must yield time for testability
  const time = yield call(Date.now);

  yield put(
    setGasEstimates({
      safeLow: gasPriceDefaults.minGwei,
      standard: gasPriceDefaults.default,
      fast: gasPriceDefaults.default,
      fastest: gasPriceDefaults.maxGwei,
      isDefault: true,
      time
    })
  );
}

export function* fetchEstimates(): SagaIterator {
  // Don't even try offline
  const isOffline: boolean = yield select(getOffline);
  if (isOffline) {
    yield call(setDefaultEstimates);
    return;
  }

  // Cache estimates for a bit
  const oldEstimates: AppState['gas']['estimates'] = yield select(getEstimates);
  if (oldEstimates && oldEstimates.time + gasEstimateCacheTime > Date.now()) {
    yield put(setGasEstimates(oldEstimates));
    return;
  }

  // Try to fetch new estimates
  try {
    const estimates: GasEstimates = yield call(fetchGasEstimates);
    yield put(setGasEstimates(estimates));
  } catch (err) {
    console.warn('Failed to fetch gas estimates:', err);
    yield call(setDefaultEstimates);
  }
}

export default function* gas(): SagaIterator {
  yield takeLatest(TypeKeys.GAS_FETCH_ESTIMATES, fetchEstimates);
}
