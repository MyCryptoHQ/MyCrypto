import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { DEFAULT_NETWORK } from '@config';
import { ClaimsService } from '@services/ApiService';
import { CLAIM_CONFIG } from '@services/ApiService/Claims/config';
import { ClaimResult, ClaimType, Network, StoreAccount } from '@types';

import {
  createAccount,
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { selectNetwork } from './network.slice';
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

  const types = Object.values(ClaimType);

  for (const type of types) {
    const config = CLAIM_CONFIG[type];
    const filteredAccounts = accounts.filter(
      (a) => a.networkId === config.network || a.networkId === DEFAULT_NETWORK
    );

    if (filteredAccounts.length === 0) continue;

    const network: Network = yield select(selectNetwork(config.network));

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
