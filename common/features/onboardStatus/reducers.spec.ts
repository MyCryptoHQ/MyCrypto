import { startOnboardSession } from './actions';
import onboardStatus, { INITIAL_STATE } from './reducers';

describe('onboardStatus reducer', () => {
  it('should handle START_ONBOARD_STATUS', () => {
    expect(onboardStatus(undefined, startOnboardSession())).toEqual({
      ...INITIAL_STATE,
      sessionStarted: true
    });
  });
});
