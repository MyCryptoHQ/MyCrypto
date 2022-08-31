import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { DEFAULT_NETWORK } from '@config';
import { ClaimsService } from '@services/ApiService';
import { CLAIM_CONFIG } from '@services/ApiService/Claims/config';
import { ClaimResult, ClaimState, ClaimType, LSKeys, Network, StoreAccount } from '@types';
import { isSameAddress } from '@utils';

import {
  createAccount,
  createAccounts,
  destroyAccount,
  getAccounts,
  resetAndCreateManyAccounts
} from './account.slice';
import { selectNetwork } from './network.slice';
import { getAppState } from './selectors';

export interface ClaimsState {
  claims: Partial<Record<ClaimType, ClaimResult[]>>;
  error: boolean;
}

export const initialState = {
  claims: {} as Partial<Record<ClaimType, ClaimResult[]>>,
  error: false
};

const slice = createSlice({
  name: LSKeys.CLAIMS,
  initialState,
  reducers: {
    setClaims(state, action: PayloadAction<{ type: ClaimType; claims: ClaimResult[] }>) {
      const addresses = action.payload.claims.map((a) => a.address);
      const existing =
        state.claims[action.payload.type]?.filter((c) =>
          addresses.every((a) => !isSameAddress(a, c.address))
        ) ?? [];
      state.claims[action.payload.type] = [...action.payload.claims, ...existing];
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
export const getSlice = createSelector([getAppState], (s) => s[slice.name]);
export const getAllClaims = createSelector([getSlice], (s) => s.claims);
export const getClaims = (type: ClaimType) =>
  createSelector([getAllClaims], (claims) => claims[type] ?? []);
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
    const networkAccounts = accounts.filter(
      (a) => a.networkId === config.network || a.networkId === DEFAULT_NETWORK
    );

    if (networkAccounts.length === 0) continue;

    const network: Network = yield select(selectNetwork(config.network));

    const existingClaims: ClaimResult[] = yield select(getClaims(type));
    const existingFinishedClaims = existingClaims
      .filter((c) => c.state !== ClaimState.UNCLAIMED)
      .map((c) => c.address);
    const existingNonFinishedClaims = existingClaims
      .filter((c) => c.state === ClaimState.UNCLAIMED)
      .reduce(
        (acc, cur) => ({
          ...acc,
          [cur.address]: { Amount: cur.amount, Index: cur.index }
        }),
        {}
      );

    try {
      const filteredAccounts = networkAccounts.filter((a) =>
        existingFinishedClaims.every((c) => !isSameAddress(c, a.address))
      );

      if (filteredAccounts.length === 0) continue;

      const rawClaims = yield call(
        [ClaimsService.instance, ClaimsService.instance.getClaims],
        type,
        filteredAccounts.map((a) => a.address)
      );

      const claims = yield call(
        [ClaimsService.instance, ClaimsService.instance.isClaimed],
        network,
        type,
        { ...rawClaims, ...existingNonFinishedClaims }
      );

      yield put(slice.actions.setClaims({ type, claims }));
    } catch (err) {
      console.error(err);
      yield put(slice.actions.fetchError());
    }
  }
}

export const { setClaims } = slice.actions;

export default slice;
