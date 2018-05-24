import { startOnboardSession } from './actions';
import { onboardStatusReducer, INITIAL_STATE } from './reducer';

describe('onboardStatus reducer', () => {
  it('should handle START_ONBOARD_STATUS', () => {
    expect(onboardStatusReducer(undefined, startOnboardSession())).toEqual({
      ...INITIAL_STATE,
      sessionStarted: true
    });
  });
});
