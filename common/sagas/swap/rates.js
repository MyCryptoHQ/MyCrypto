// @flow
import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';

import { getAllRates } from 'api/bity';

import { loadBityRatesSucceededSwap } from 'actions/swap';
import { showNotification } from 'actions/notifications';

import type { Yield, Return, Next } from 'sagas/types';

export function* loadBityRates(_action?: any): Generator<Yield, Return, Next> {
  while (true) {
    try {
      const data = yield call(getAllRates);
      yield put(loadBityRatesSucceededSwap(data));
    } catch (error) {
      yield put(yield showNotification('danger', error));
    }
    yield call(delay, 5000);
  }
}

// Fork our recurring API call, watch for the need to cancel.
function* handleBityRates(): Generator<Yield, Return, Next> {
  const loadBityRatesTask = yield fork(loadBityRates);
  yield take('SWAP_STOP_LOAD_BITY_RATES');
  yield cancel(loadBityRatesTask);
}

// Watch for latest SWAP_LOAD_BITY_RATES_REQUESTED action.
export function* getBityRatesSaga(): Generator<Yield, Return, Next> {
  yield takeLatest('SWAP_LOAD_BITY_RATES_REQUESTED', handleBityRates);
}
