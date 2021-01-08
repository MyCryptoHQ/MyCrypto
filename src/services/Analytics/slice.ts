import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, takeEvery } from 'redux-saga/effects';

import { AppState } from '@store';

import { default as AnalyticsService, TrackParams } from './Analytics';

export const initialState = {
  canTrackProductAnalytics: true
};

/**
 * Simple reducer to store user preferences
 */
const slice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setProductAnalyticsAuthorisation(state, action: PayloadAction<boolean>) {
      state.canTrackProductAnalytics = action.payload;
    }
  }
});

export default slice;

/**
 * Selectors
 */
const getAnalytics = (s: AppState) => s[slice.name];
export const canTrackProductAnalytics = createSelector(
  getAnalytics,
  (s) => s.canTrackProductAnalytics
);

/**
 * Actions
 */
export const trackEvent = createAction<TrackParams>(`${slice.name}/trackEvent`);

/**
 * Saga
 */
export function* analyticsSaga() {
  yield takeEvery(trackEvent.type, trackEventWorker);
}
function* trackEventWorker({ payload }: PayloadAction<TrackParams>) {
  yield call(AnalyticsService.track, payload);
}
