// @flow

import { call, put, fork, take, cancel, cancelled } from 'redux-saga/effects';

import type { Effect } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { updateBityRatesSwap } from 'actions/swap';
import {
  SWAP_LOAD_BITY_RATES,
  SWAP_STOP_LOAD_BITY_RATES
} from 'actions/swapConstants';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import { getAllRates } from 'api/bity';

export function* loadBityRates(action?: any): Generator<Effect, void, any> {
  try {
    while (true) {
      // TODO - yield put(actions.requestStart()) if we want to display swap refresh status
      // network request
      const data = yield call(getAllRates);
      // action
      yield put(updateBityRatesSwap(data));
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

export default function* bitySaga(): Generator<Effect, void, any> {
  while (yield take(SWAP_LOAD_BITY_RATES)) {
    // starts the task in the background
    const loadBityRatesTask = yield fork(loadBityRates);

    // wait for the user to get to point where refresh is no longer needed
    yield take(SWAP_STOP_LOAD_BITY_RATES);
    // cancel the background task
    // this will cause the forked loadBityRates task to jump into its finally block
    yield cancel(loadBityRatesTask);
  }
}
