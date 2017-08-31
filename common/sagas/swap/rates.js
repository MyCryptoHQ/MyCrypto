// @flow
import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';

import { getAllRates } from 'api/bity';

import { loadBityRatesSucceededSwap } from 'actions/swap';
import { showNotification } from 'actions/notifications';

// @TODO Move this to a type definition file in sagas for reuse.
type Yield = Effect | {};
type Return = void;
type Next = any;

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
function* handleBityRates() {
  const loadBityRatesTask = yield fork(loadBityRates);
  yield take('SWAP_STOP_LOAD_BITY_RATES');
  yield cancel(loadBityRatesTask);
}

// Watch for latest SWAP_LOAD_BITY_RATES_REQUESTED action.
export function* getBityRatesSaga(): Generator<Effect, void, any> {
  yield takeLatest('SWAP_LOAD_BITY_RATES_REQUESTED', handleBityRates);
}
