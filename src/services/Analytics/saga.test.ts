import { call, put, select } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { getAnalyticsUserID, setAnalyticsUserID, setProductAnalyticsAuthorisation } from '@store';

import { featureFlagSlice } from '../FeatureFlag';
import { initialState, default as settingsSlice } from '../Store/store/settings.slice';
import { default as AnalyticsService, LinkParams, TrackParams } from './Analytics';
import { makeID } from './helpers';
import {
  analyticsSaga,
  deactivateAnalyticsWorker,
  initAnalytics,
  setAnalyticsID,
  trackEvent,
  trackEventWorker,
  trackLink,
  trackLinkWorker
} from './saga';

jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers'),
  makeID: jest.fn()
}));

describe('AnalyticsSaga', () => {
  it('analyticsSaga(): calls AnalyticsService on dispatch', () => {
    const params: TrackParams = { action: 'Add Account' };
    expectSaga(analyticsSaga)
      .withState(mockAppState({ [settingsSlice.name]: initialState }))
      .provide([[call.fn(AnalyticsService.track), params]])
      .dispatch(trackEvent(params))
      .silentRun();
  });
  it('trackInit(): noOps when feature is inactive', () => {
    return expectSaga(initAnalytics)
      .withState({
        ...mockAppState({ [settingsSlice.name]: initialState }),
        [featureFlagSlice.name]: { ANALYTICS: false }
      })
      .run()
      .then(({ effects }) => {
        expect(effects.select).toHaveLength(3);
        expect(effects.call).toBeUndefined();
        expect(effects.put).toBeUndefined();
      });
  });
  it('respects user tracking preferences', () => {
    const params: TrackParams = { action: 'Add Account' };
    return expectSaga(trackEventWorker, trackEvent(params))
      .withState(
        mockAppState({ [settingsSlice.name]: { ...initialState, canTrackProductAnalytics: false } })
      )
      .run()
      .then(({ effects }) => {
        expect(effects.select).toHaveLength(1);
        expect(effects.call).toBeUndefined();
        expect(effects.put).toBeUndefined();
      });
  });
  it('setAnalyticsID(): sets analytics ID', () => {
    const exampleAnalyticsUserID = makeID();
    (makeID as jest.Mock).mockReturnValueOnce(exampleAnalyticsUserID);

    return expectSaga(setAnalyticsID)
      .withState(mockAppState({ [settingsSlice.name]: initialState }))
      .run()
      .then(({ effects }) => {
        expect(effects.select).toHaveLength(1);
        expect(effects.call).toHaveLength(1);
        expect(effects.put).toHaveLength(1);

        expect(effects.select[0]).toEqual(select(getAnalyticsUserID));
        expect(effects.put[0]).toEqual(put(setAnalyticsUserID(exampleAnalyticsUserID)));
        expect(effects.call[0]).toEqual(
          call(AnalyticsService.setAnonymousID, exampleAnalyticsUserID)
        );
      });
  });
  it('deactivateAnalyticsWorker(): sets analytics ID on analytics authorisation', () => {
    const exampleAnalyticsUserID = makeID();
    (makeID as jest.Mock).mockReturnValueOnce(exampleAnalyticsUserID);

    return expectSaga(deactivateAnalyticsWorker, setProductAnalyticsAuthorisation(true))
      .withState(mockAppState({ [settingsSlice.name]: initialState }))
      .run()
      .then(({ effects }) => {
        expect(effects.select).toHaveLength(1);
        expect(effects.call).toHaveLength(3);
        expect(effects.put).toHaveLength(1);

        expect(effects.call[0]).toEqual(call(setAnalyticsID));
      });
  });
  it('deactivateAnalyticsWorker(): deletes analytics ID without analytics authorisation', () => {
    const exampleAnalyticsUserID = makeID();
    (makeID as jest.Mock).mockReturnValueOnce(exampleAnalyticsUserID);

    return expectSaga(deactivateAnalyticsWorker, setProductAnalyticsAuthorisation(false))
      .withState(mockAppState({ [settingsSlice.name]: initialState }))
      .run()
      .then(({ effects }) => {
        expect(effects.select).toBeUndefined();
        expect(effects.call).toBeUndefined();
        expect(effects.put).toHaveLength(1);

        expect(effects.put[0]).toEqual(put(setAnalyticsUserID('')));
      });
  });
  it('trackLinkWorker(): tracks link', () => {
    const params: LinkParams = { url: 'https://mycrypto.com', type: 'link' };
    return expectSaga(trackLinkWorker, trackLink(params))
      .withState(mockAppState({ [settingsSlice.name]: initialState }))
      .run()
      .then(({ effects }) => {
        expect(effects.select).toHaveLength(1);
        expect(effects.call).toHaveLength(1);
        expect(effects.put).toBeUndefined();

        expect(effects.call[0]).toEqual(call(AnalyticsService.trackLink, params));
      });
  });
});
