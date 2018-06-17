import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { gasPriceDefaults, gasEstimateCacheTime } from 'config';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configSelectors from 'features/config/selectors';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export function* setDefaultEstimates(network: NetworkConfig): SagaIterator {
  // Must yield time for testability
  const time = yield call(Date.now);
  const gasSettings = network.isCustom ? gasPriceDefaults : network.gasPriceSettings;

  yield put(
    actions.setGasEstimates({
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
  const network: NetworkConfig = yield select(configSelectors.getNetworkConfig);
  if (network.isCustom || !network.shouldEstimateGasPrice) {
    yield call(setDefaultEstimates, network);
    return;
  }

  // Don't try while offline
  const isOffline: boolean = yield select(configMetaSelectors.getOffline);
  if (isOffline) {
    yield call(setDefaultEstimates, network);
    return;
  }

  // Cache estimates for a bit
  const oldEstimates: AppState['gas']['estimates'] = yield select(selectors.getEstimates);
  if (
    oldEstimates &&
    oldEstimates.chainId === network.chainId &&
    oldEstimates.time + gasEstimateCacheTime > Date.now()
  ) {
    yield put(actions.setGasEstimates(oldEstimates));
    return;
  }

  // Try to fetch new estimates
  try {
    const estimates: GasEstimates = yield call(fetchGasEstimates);
    yield put(actions.setGasEstimates(estimates));
  } catch (err) {
    console.warn('Failed to fetch gas estimates:', err);
    yield call(setDefaultEstimates, network);
  }
}

export function* gasSaga(): SagaIterator {
  yield takeLatest(types.GasActions.FETCH_ESTIMATES, fetchEstimates);
}
