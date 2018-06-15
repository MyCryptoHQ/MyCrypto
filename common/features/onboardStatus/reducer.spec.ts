import * as onboardStatusActions from './actions';
import * as onboardStatusReducer from './reducer';

describe('onboardStatus reducer', () => {
  it('should handle START_ONBOARD_STATUS', () => {
    expect(
      onboardStatusReducer.onboardStatusReducer(
        undefined,
        onboardStatusActions.startOnboardSession()
      )
    ).toEqual({
      ...onboardStatusReducer.INITIAL_STATE,
      sessionStarted: true
    });
  });
});
