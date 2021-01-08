import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'test-utils';

import { default as AnalyticsService, TrackParams } from './Analytics';
import { analyticsSaga, initialState, default as slice, trackEvent } from './slice';

const reducer = slice.reducer;

describe('AnalyticsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setProductAnalyticsAuthorisation(): can set value to false', () => {
    const actual = reducer(initialState, slice.actions.setProductAnalyticsAuthorisation(false));
    const expected = { canTrackProductAnalytics: false };
    expect(actual).toEqual(expected);
  });

  it('setProductAnalyticsAuthorisation(): can set value to true', () => {
    const actual = reducer(initialState, slice.actions.setProductAnalyticsAuthorisation(true));
    const expected = { canTrackProductAnalytics: true };
    expect(actual).toEqual(expected);
  });
});

describe('AnalyticsSaga', () => {
  it('calls AnalyticsService on dispatch', () => {
    const params: TrackParams = { name: 'Add Account' };
    expectSaga(analyticsSaga)
      .provide([[call.fn(AnalyticsService.track), params]])
      .dispatch(trackEvent(params))
      .silentRun();
  });
});
