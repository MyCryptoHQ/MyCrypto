import * as actions from './actions';
import * as reducer from './reducer';

describe('onboardStatus reducer', () => {
  it('should handle START_ONBOARD_STATUS', () => {
    expect(reducer.onboardStatusReducer(undefined, actions.startOnboardSession())).toEqual({
      ...reducer.INITIAL_STATE,
      sessionStarted: true
    });
  });
});
