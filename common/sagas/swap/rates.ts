import { showNotification } from 'actions/notifications';
import { loadBityRatesSucceededSwap } from 'actions/swap';
import { TypeKeys } from 'actions/swap/constants';
import { getAllRates } from 'api/bity';
import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';

const POLLING_CYCLE = 30000;

export function* loadBityRates(): SagaIterator {
  while (true) {
    try {
      const data = yield call(getAllRates);
      yield put(loadBityRatesSucceededSwap(data));
    } catch (error) {
      yield put(showNotification('danger', error.message));
    }
    yield call(delay, POLLING_CYCLE);
  }
}

// Fork our recurring API call, watch for the need to cancel.
export function* handleBityRates(): SagaIterator {
  const loadBityRatesTask = yield fork(loadBityRates);
  yield take(TypeKeys.SWAP_STOP_LOAD_BITY_RATES);
  yield cancel(loadBityRatesTask);
}

// Watch for latest SWAP_LOAD_BITY_RATES_REQUESTED action.
export function* getBityRatesSaga(): SagaIterator {
  yield takeLatest(TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED, handleBityRates);
}
