import { showNotification } from 'actions/notifications';
import { loadBityRatesSucceededSwap } from 'actions/swap';
import { getAllRates } from 'api/bity';
import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';

export function* loadBityRates(action?: any): SagaIterator {
  while (true) {
    try {
      const data = yield call(getAllRates);
      yield put(loadBityRatesSucceededSwap(data));
    } catch (error) {
      yield put(showNotification('danger', error.message));
    }
    yield call(delay, 5000);
  }
}

// Fork our recurring API call, watch for the need to cancel.
function* handleBityRates(): SagaIterator {
  const loadBityRatesTask = yield fork(loadBityRates);
  yield take('SWAP_STOP_LOAD_BITY_RATES');
  yield cancel(loadBityRatesTask);
}

// Watch for latest SWAP_LOAD_BITY_RATES_REQUESTED action.
export function* getBityRatesSaga(): SagaIterator {
  yield takeLatest('SWAP_LOAD_BITY_RATES_REQUESTED', handleBityRates);
}
