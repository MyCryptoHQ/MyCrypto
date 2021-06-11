import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { UniswapService } from '@services/ApiService/Uniswap';
import { ClaimResult, IAccount, Network, StoreAccount } from '@types';

import {
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { selectDefaultNetwork } from './network.slice';
import { AppState } from './root.reducer';

export const initialState = {
  uniClaims: [] as ClaimResult[],
  error: false
};

const slice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setUniClaims(state, action: PayloadAction<ClaimResult[]>) {
      state.uniClaims = action.payload;
    },
    fetchError(state) {
      state.error = true;
    }
  }
});

export const fetchClaims = createAction<IAccount[] | undefined>(`${slice.name}/fetchClaims`);

/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.claims,
  (s) => s
);
export const getUniClaims = createSelector([getSlice], (s) => s.uniClaims);
/**
 * Sagas
 */
export function* claimsSaga() {
  yield all([
    takeLatest(
      [createAccounts.type, resetAndCreateManyAccounts.type, destroyAccount.type],
      fetchUniClaimsWorker
    ),
    takeLatest(fetchClaims.type, fetchUniClaimsWorker)
  ]);
}

export function* fetchUniClaimsWorker() {
  const accounts: StoreAccount[] = yield select(getAccounts);

  const filteredAccounts = accounts.filter((a) => a.networkId === 'Ethereum');

  if (filteredAccounts.length === 0) return;

  const network: Network = yield select(selectDefaultNetwork);

  try {
    const rawClaims = yield call(
      UniswapService.instance.getClaims,
      filteredAccounts.map((a) => a.address)
    );

    const claims = yield call(UniswapService.instance.isClaimed, network, rawClaims);

    yield put(slice.actions.setUniClaims(claims));
  } catch (err) {
    yield put(slice.actions.fetchError());
  }
}

export const { setUniClaims } = slice.actions;

export default slice;
