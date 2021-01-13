import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { canTrackProductAnalytics, setProductAnalyticsAuthorisation } from '@store';

import { default as AnalyticsService, PageParams, TrackParams } from './Analytics';

/**
 * Actions
 */
export const trackInit = createAction(`analytics/init`);
export const trackEvent = createAction<TrackParams>(`analytics/trackEvent`);
export const trackPage = createAction<PageParams>(`analytics/trackPage`);

/**
 * Saga
 */
export function* analyticsSaga() {
  yield takeLatest(trackInit, initAnalytics);
  yield takeEvery(trackEvent.type, trackEventWorker);
  yield takeEvery(trackPage.type, trackPageWorker);
  yield takeEvery(setProductAnalyticsAuthorisation, deactivateAnalyticsWorker);
}

function* initAnalytics() {
  const canTrack = yield select(canTrackProductAnalytics);
  if (canTrack) {
    yield call(AnalyticsService.initAnalytics);
    yield put(trackEvent({ name: 'App Load' }));
  }
}

export function* deactivateAnalyticsWorker({ payload }: PayloadAction<boolean>) {
  if (payload) {
    yield call(AnalyticsService.setAnonymousID);
  } else {
    yield call(AnalyticsService.clearAnonymousID);
  }
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
