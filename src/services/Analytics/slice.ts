import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, fork, put, select, takeEvery } from 'redux-saga/effects';

import { AppState } from '@store';

import { default as AnalyticsService, PageParams, TrackParams } from './Analytics';

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
export const { setProductAnalyticsAuthorisation } = slice.actions;

/**
 * Selectors
 */
const getAnalytics = (s: AppState) => s[slice.name];
export const canTrackProductAnalytics = createSelector([getAnalytics], (s) => {
  return s.canTrackProductAnalytics;
});

/**
 * Actions
 */
export const trackEvent = createAction<TrackParams>(`${slice.name}/trackEvent`);
export const trackPage = createAction<PageParams>(`${slice.name}/trackPage`);

/**
 * Saga
 */
export function* analyticsSaga() {
  yield fork(initAnalytics);
  yield takeEvery(trackEvent.type, trackEventWorker);
  yield takeEvery(trackPage.type, trackPageWorker);
}

function* initAnalytics() {
  yield call(AnalyticsService.initAnalytics);
  yield put(trackEvent({ name: 'App Load' }));
}

export function* trackEventWorker({ payload }: PayloadAction<TrackParams>) {
  const canTrack = yield select(canTrackProductAnalytics);
  if (canTrack) {
    yield call(AnalyticsService.track, payload);
  }
}

export function* trackPageWorker({ payload }: PayloadAction<PageParams>) {
  const canTrack = yield select(canTrackProductAnalytics);
  if (canTrack) {
    yield call(AnalyticsService.trackPage, payload);
  }
}
