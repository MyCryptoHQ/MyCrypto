// @flow

import { takeEvery, call, apply, put, select, fork } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { updateBityRatesSwap } from 'actions/swap';
import { SWAP_LOAD_BITY_RATES } from 'actions/swapConstants';
import type { UnlockPrivateKeyAction } from 'actions/wallet';
import { getAllRates } from 'api/bity';

export function* loadBityRates(action?: any): Generator<Effect, void, any> {
  if (!action) return;
  const data = yield call(getAllRates);
  yield put(updateBityRatesSwap(data));
}

export default function* bitySaga(): Generator<Effect, void, any> {
  yield takeEvery(SWAP_LOAD_BITY_RATES, loadBityRates);
}
