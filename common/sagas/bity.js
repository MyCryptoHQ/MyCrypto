// @flow

import { takeLatest, call, apply, put, select, fork } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { updateBityRatesSwap } from 'actions/swap';
import { SWAP_LOAD_BITY_RATES } from 'actions/swapConstants';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import { getAllRates } from 'api/bity';

export function* loadBityRates(action?: any): Generator<Effect, void, any> {
  if (!action) return;
  // eslint-disable-next-line
  while (true) {
    const data = yield call(getAllRates);
    yield put(updateBityRatesSwap(data));
    yield call(delay, 5000);
  }
}

export default function* bitySaga(): Generator<Effect, void, any> {
  yield takeLatest(SWAP_LOAD_BITY_RATES, loadBityRates);
}
