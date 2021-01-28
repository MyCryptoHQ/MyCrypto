import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { featureFlagSlice } from '../FeatureFlag';
import { initialState, default as settingsSlice } from '../Store/store/settings.slice';
import { default as AnalyticsService, TrackParams } from './Analytics';
import { analyticsSaga, initAnalytics, trackEvent, trackEventWorker } from './saga';

describe('AnalyticsSaga', () => {
  it('analyticsSaga(): calls AnalyticsService on dispatch', () => {
    const params: TrackParams = { name: 'Add Account' };
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
    const params: TrackParams = { name: 'Add Account' };
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
});
