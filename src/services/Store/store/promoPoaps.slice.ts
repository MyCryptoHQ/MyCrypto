import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { PROMO_CONFIG } from '@config';
import { IAccount, LSKeys, PromoPoap } from '@types';
import { dateIsBetween } from '@utils';

import { getAccounts } from './account.slice';
import { displayNotification } from './notification.slice';
import { getAppState } from './selectors';
import { addAccountsToCurrents } from './settings.slice';

const sliceName = LSKeys.PROMO_POAPS;

export interface PromoPoapsState {
  promos: Record<string, PromoPoap>;
}

export const initialState = { promos: {} } as PromoPoapsState;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    claim(state, action: PayloadAction<{ key: string; claim: string }>) {
      state.promos[action.payload.key] = { ...action.payload, claimed: true };
    }
  }
});

export const checkForPromos = createAction(`${slice.name}/check`);

export const { claim: claimPromo } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getSlice = createSelector([getAppState], (s) => s[slice.name]);

export const getPromos = createSelector([getSlice], (s) => Object.values(s.promos));

export const getPromoPoap = (key: string) =>
  createSelector([getPromos], (promos) => promos.find((p) => p.key === key));

/**
 * Sagas
 */
export function* promoPoapsSaga() {
  yield all([
    takeLatest(checkForPromos.type, checkForPromosWorker),
    takeLatest(addAccountsToCurrents.type, checkForPromosWorker)
  ]);
}

export function* checkForPromosWorker() {
  const accounts: IAccount[] = yield select(getAccounts);
  if (accounts.filter((a) => a.wallet !== 'VIEW_ONLY').length === 0) {
    return;
  }
  const currentPromos = PROMO_CONFIG.filter(
    (c) => dateIsBetween(c.startDate, c.endDate, Date.now() / 1000) && c.notification
  );
  for (const promo of currentPromos) {
    yield put(displayNotification({ templateName: promo.notification! }));
  }
}
