// @flow
import { delay } from 'redux-saga';
import { getAllRates } from 'api/bity';
import { call, put, fork, take, cancel, cancelled } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { loadBityRatesSucceededSwap } from 'actions/swap';

export function* loadBityRates(_action?: any): Generator<Effect, void, any> {
  try {
    while (true) {
      // TODO - BITY_RATE_REQUESTED
      // network request
      const data = yield call(getAllRates);
      // action
      yield put(loadBityRatesSucceededSwap(data));
      // wait 5 seconds before refreshing rates
      yield call(delay, 5000);
    }
  } finally {
    if (yield cancelled()) {
      // TODO - implement request cancel if needed
      // yield put(actions.requestFailure('Request cancelled!'))
    }
  }
}

export function* getBityRatesSaga(): Generator<Effect, void, any> {
  while (yield take('SWAP_LOAD_BITY_RATES_REQUESTED')) {
    // starts the task in the background
    const loadBityRatesTask = yield fork(loadBityRates);
    // wait for the user to get to point where refresh is no longer needed
    yield take('SWAP_STOP_LOAD_BITY_RATES');
    // cancel the background task
    // this will cause the forked loadBityRates task to jump into its finally block
    yield cancel(loadBityRatesTask);
  }
}
