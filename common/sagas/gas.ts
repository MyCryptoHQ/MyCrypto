import { setGasEstimates, TypeKeys } from 'actions/gas';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { AppState } from 'reducers';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import { gasPriceDefaults, gasEstimateCacheTime } from 'config';
import { getEstimates } from 'selectors/gas';
import { getOffline, getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';

export function* setDefaultEstimates(network: NetworkConfig): SagaIterator {
  // Must yield time for testability
  const time = yield call(Date.now);
  const gasSettings = network.isCustom ? gasPriceDefaults : network.gasPriceSettings;

  yield put(
    setGasEstimates({
      safeLow: gasSettings.min,
      standard: gasSettings.initial,
      fast: gasSettings.initial,
      fastest: gasSettings.max,
      isDefault: true,
      chainId: network.chainId,
      time
    })
  );
}

export function* fetchEstimates(): SagaIterator {
  // Don't try on non-estimating network
  const network: NetworkConfig = yield select(getNetworkConfig);
  if (network.isCustom || !network.shouldEstimateGasPrice) {
    yield call(setDefaultEstimates, network);
    return;
  }

  // Don't try while offline
  const isOffline: boolean = yield select(getOffline);
  if (isOffline) {
    yield call(setDefaultEstimates, network);
    return;
  }

  // Cache estimates for a bit
  const oldEstimates: AppState['gas']['estimates'] = yield select(getEstimates);
  if (
    oldEstimates &&
    oldEstimates.chainId === network.chainId &&
    oldEstimates.time + gasEstimateCacheTime > Date.now()
  ) {
    yield put(setGasEstimates(oldEstimates));
    return;
  }

  // Try to fetch new estimates
  try {
    const estimates: GasEstimates = yield call(fetchGasEstimates);
    yield put(setGasEstimates(estimates));
  } catch (err) {
    console.warn('Failed to fetch gas estimates:', err);
    yield call(setDefaultEstimates, network);
  }
}

export default function* gas(): SagaIterator {
  yield takeLatest(TypeKeys.GAS_FETCH_ESTIMATES, fetchEstimates);
}
