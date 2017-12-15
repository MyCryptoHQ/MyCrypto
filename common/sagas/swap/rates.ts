import { showNotification } from 'actions/notifications';
import { loadBityRatesSucceededSwap, loadShapeshiftRatesSucceededSwap } from 'actions/swap';
import { TypeKeys } from 'actions/swap/constants';
import { getAllRates } from 'api/bity';
import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest, race } from 'redux-saga/effects';
import shapeshift from 'api/shapeshift';

const POLLING_CYCLE = 30000;
const SHAPESHIFT_TIMEOUT = 20000;

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

export function* loadShapeshiftRates(): SagaIterator {
  while (true) {
    try {
      // Race b/w api call and timeout
      // getShapeShiftRates should be an api call that accepts a whitelisted arr of symbols
      const { tokens } = yield race({
        tokens: call(shapeshift.getAllRates),
        timeout: call(delay, SHAPESHIFT_TIMEOUT)
      });
      // If tokens exist, put it into the redux state, otherwise switch to bity.
      if (tokens) {
        yield put(loadShapeshiftRatesSucceededSwap(tokens));
      } else {
        console.log('fail');
        // yield put(failAndSwitchTo('bity'));
      }
    } catch (error) {
      // SWAP_STOP_LOAD_SHAPESHIFT_RATES
      // put(loadShapeshiftRatesStopSwap());
      put(showNotification('danger', 'Error loading ShapeShift tokens - reverting to Bity'));
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

// Fork our API call
export function* handleShapeShiftRates(): SagaIterator {
  const loadShapeShiftRatesTask = yield fork(loadShapeshiftRates);
  yield take(TypeKeys.SWAP_STOP_LOAD_SHAPESHIFT_RATES);
  yield cancel(loadShapeShiftRatesTask);
}

// Watch for SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED action.
export function* getShapeShiftRatesSaga(): SagaIterator {
  yield takeLatest(TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED, handleShapeShiftRates);
}
