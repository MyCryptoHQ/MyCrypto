import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { canTrackProductAnalytics, setProductAnalyticsAuthorisation } from '@store';

import { isActiveFeature } from '../FeatureFlag';
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
  yield all([
    yield takeEvery(trackInit, initAnalytics),
    yield takeEvery(trackEvent.type, trackEventWorker),
    yield takeEvery(trackPage.type, trackPageWorker),
    yield takeEvery(setProductAnalyticsAuthorisation, deactivateAnalyticsWorker)
  ]);
}

function* initAnalytics() {
  const isActive = yield select(isActiveFeature('ANALYTICS'));
  const canTrack = yield select(canTrackProductAnalytics);
  if (isActive && canTrack) {
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
