import { showNotification } from 'actions/notifications';
import {
  loadBityRatesSucceededSwap,
  loadShapeshiftRatesSucceededSwap,
  changeSwapProvider,
  ChangeProviderSwapAcion
} from 'actions/swap';
import { TypeKeys } from 'actions/swap/constants';
import { getAllRates } from 'api/bity';
import { delay, SagaIterator } from 'redux-saga';
import { call, select, put, takeLatest, race } from 'redux-saga/effects';
import shapeshift from 'api/shapeshift';
import { getSwap } from 'sagas/swap/orders';

export const SHAPESHIFT_TIMEOUT = 10000;

export function* loadBityRates(): SagaIterator {
  try {
    const data = yield call(getAllRates);
    yield put(loadBityRatesSucceededSwap(data));
  } catch (error) {
    console.error('Failed to load rates from Bity:', error);
    yield put(showNotification('danger', error.message));
  }
}

export function* loadShapeshiftRates(): SagaIterator {
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
      throw new Error('ShapeShift rates request timed out.');
    }
  } catch (error) {
    console.error('Failed to fetch rates from shapeshift:', error);
    yield put(
      showNotification(
        'danger',
        'Failed to load swap rates from ShapeShift, please try again later'
      )
    );
  }
}

export function* swapProvider(action: ChangeProviderSwapAcion): SagaIterator {
  const swap = yield select(getSwap);
  if (swap.provider !== action.payload) {
    yield put(changeSwapProvider(action.payload));
  }
}

export default function* swapRates(): SagaIterator {
  yield takeLatest(TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED, loadBityRates);
  yield takeLatest(TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED, loadShapeshiftRates);
  yield takeLatest(TypeKeys.SWAP_CHANGE_PROVIDER, swapProvider);
}
