import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { ClaimsService } from '@services/ApiService';
import { ClaimResult, ClaimType, Network, StoreAccount } from '@types';

import {
  createAccount,
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { selectDefaultNetwork } from './network.slice';
import { AppState } from './root.reducer';

export const initialState = {
  claims: {} as Record<ClaimType, ClaimResult[]>,
  error: false
};

const slice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setClaims(state, action: PayloadAction<{ type: ClaimType; claims: ClaimResult[] }>) {
      state.claims[action.payload.type] = action.payload.claims;
    },
    fetchError(state) {
      state.error = true;
    }
  }
});

export const fetchClaims = createAction(`${slice.name}/fetchClaims`);

/**
 * Selectors
 */
export const getSlice = createSelector(
  (s: AppState) => s.claims,
  (s) => s
);
export const getAllClaims = createSelector([getSlice], (s) => s.claims);
export const getClaims = (type: ClaimType) =>
  createSelector([getAllClaims], (claims) => claims[type]);
/**
 * Sagas
 */
export function* claimsSaga() {
  yield all([
    takeLatest(
      [
        createAccount.type,
        createAccounts.type,
        resetAndCreateManyAccounts.type,
        destroyAccount.type
      ],
      fetchClaimsWorker
    ),
    takeLatest(fetchClaims.type, fetchClaimsWorker)
  ]);
}

export function* fetchClaimsWorker() {
  const accounts: StoreAccount[] = yield select(getAccounts);

  const filteredAccounts = accounts.filter((a) => a.networkId === 'Ethereum');

  if (filteredAccounts.length === 0) return;

  const network: Network = yield select(selectDefaultNetwork);

  const types = Object.values(ClaimType);

  for (const type of types) {
    try {
      const rawClaims = yield call(
        [ClaimsService.instance, ClaimsService.instance.getClaims],
        type,
        filteredAccounts.map((a) => a.address)
      );

      const claims = yield call(
        [ClaimsService.instance, ClaimsService.instance.isClaimed],
        network,
        type,
        rawClaims
      );

      yield put(slice.actions.setClaims({ type, claims }));
    } catch (err) {
      yield put(slice.actions.fetchError());
    }
  }
}

export const { setClaims } = slice.actions;

export default slice;
