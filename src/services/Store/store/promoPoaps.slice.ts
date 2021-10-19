import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { NotificationTemplates } from '@features/NotificationsPanel';
import { dateIsBetween } from '@utils';

import { displayNotification } from './notification.slice';
import { AppState } from './root.reducer';

const sliceName = 'promoPoaps';
export const initialState = { promos: {} as Record<string, PromoPoap> };

const config = [
  {
    key: 'halloween2021',
    notification: NotificationTemplates.halloweenPoap,
    startDate: new Date('2021-10-19'),
    endDate: new Date('2021-10-31')
  }
];

interface PromoPoap {
  key: string;
  claimed: boolean;
  claim: string;
}

// @todo Persistence
const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<PromoPoap>) {
      state.promos[action.payload.key] = action.payload;
    },
    update(state, action: PayloadAction<PromoPoap>) {
      state.promos[action.payload.key] = action.payload;
    }
  }
});

export const checkForPromos = createAction(`${slice.name}/check`);

export const { create: createUserAction, update: updateUserAction } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getSlice = createSelector(
  (s: AppState) => s.promoPoaps,
  (s) => s
);

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
