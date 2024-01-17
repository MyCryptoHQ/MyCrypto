import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { all, call, put, select } from 'redux-saga/effects';

import { DEFAULT_NETWORK } from '@config';
import { ProviderHandler } from '@services/EthService';
import { IPollingPayload, pollingSaga } from '@services/Polling';
import { bigify } from '@utils';

import { getNetwork } from './network.slice';
import { AppState } from './root.reducer';

export const initialState = {
  baseFee: undefined as BigNumber | undefined
};

const slice = createSlice({
  name: 'gas',
  initialState,
  reducers: {
    setBaseFee(state, action: PayloadAction<BigNumber>) {
      state.baseFee = action.payload;
    }
  }
});

export const startGasPolling = createAction(`${slice.name}/startPolling`);
export const stopGasPolling = createAction(`${slice.name}/stopPolling`);

export const { setBaseFee } = slice.actions;

export default slice;

/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.gas,
  (s) => s
);
export const getBaseFee = createSelector([getSlice], (s) => s.baseFee);

/**
 * Sagas
 */
const payload: IPollingPayload = {
  startAction: startGasPolling,
  stopAction: stopGasPolling,
  params: {
    interval: 90000,
    retryOnFailure: true,
    retries: 3,
    retryAfter: 3000
  },
  saga: fetchGas
};

export function* gasSaga() {
  yield all([pollingSaga(payload)]);
}

export function* fetchGas() {
  const network = yield select(getNetwork(DEFAULT_NETWORK));

  const provider = new ProviderHandler(network);

  try {
    const latestBlock = yield call([provider, provider.getLatestBlock]);

    if (latestBlock?.baseFeePerGas) {
      yield put(setBaseFee(bigify(latestBlock.baseFeePerGas)));
    }
  } catch (err) {
    console.error(err);
  }
}
