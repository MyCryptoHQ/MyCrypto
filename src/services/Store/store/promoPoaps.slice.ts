import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { NotificationTemplates } from '@features/NotificationsPanel';
import { LSKeys, PromoPoap } from '@types';
import { dateIsBetween } from '@utils';

import { displayNotification } from './notification.slice';
import { getAppState } from './selectors';

const sliceName = LSKeys.PROMO_POAPS;

export interface PromoPoapsState {
  promos: Record<string, PromoPoap>;
}

export const initialState = { promos: {} } as PromoPoapsState;

const config = [
  {
    key: 'halloween2021',
    notification: NotificationTemplates.halloweenPoap,
    startDate: new Date('2021-10-19'),
    endDate: new Date('2021-10-31')
  }
];

// @todo Persistence
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
  yield all([takeLatest(checkForPromos.type, checkForPromosWorker)]);
}

export function* checkForPromosWorker() {
  const currentPromos = config.filter(
    (c) => dateIsBetween(c.startDate, c.endDate) && c.notification
  );
  for (const promo of currentPromos) {
    yield put(displayNotification({ templateName: promo.notification }));
  }
}
