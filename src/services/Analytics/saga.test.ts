import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { initialState, default as slice } from '@store/settings.slice';

import { default as AnalyticsService, TrackParams } from './Analytics';
import { analyticsSaga, trackEvent, trackEventWorker } from './saga';

describe('AnalyticsSaga', () => {
  it('calls AnalyticsService on dispatch', () => {
    const params: TrackParams = { name: 'Add Account' };
    expectSaga(analyticsSaga)
      .withState(mockAppState({ [slice.name]: initialState }))
      .provide([[call.fn(AnalyticsService.track), params]])
      .dispatch(trackEvent(params))
      .silentRun();
  });
  it('respects user tracking preferences', () => {
    const params: TrackParams = { name: 'Add Account' };
    return expectSaga(trackEventWorker, trackEvent(params))
      .withState(
        mockAppState({ [slice.name]: { ...initialState, canTrackProductAnalytics: false } })
      )
      .run()
      .then(({ effects }) => {
        expect(effects.select).toHaveLength(1);
        expect(effects.call).toBeUndefined();
        expect(effects.put).toBeUndefined();
      });
  });
});
