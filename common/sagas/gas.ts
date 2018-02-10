import { setGasEstimates, TypeKeys } from 'actions/gas';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import { gasPriceDefaults } from 'config';

export function* fetchEstimates(): SagaIterator {
  try {
    const estimates: GasEstimates = yield call(fetchGasEstimates);
    yield put(setGasEstimates(estimates));
  } catch (err) {
    console.warn('Failed to fetch gas estimates', err);
    yield put(
      setGasEstimates({
        safeLow: gasPriceDefaults.minGwei,
        standard: gasPriceDefaults.default,
        fast: gasPriceDefaults.default,
        fastest: gasPriceDefaults.maxGwei
      })
    );
  }
}

export default function* gas(): SagaIterator {
  yield takeLatest(TypeKeys.GAS_FETCH_ESTIMATES, fetchEstimates);
}
