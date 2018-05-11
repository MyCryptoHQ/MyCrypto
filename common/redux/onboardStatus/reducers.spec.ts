import onboardStatus, { INITIAL_STATE } from './reducers';
import * as onboardStatusActions from './actions';

describe('onboardStatus reducer', () => {
  it('should handle START_ONBOARD_STATUS', () => {
    expect(onboardStatus(undefined, onboardStatusActions.startOnboardSession())).toEqual({
      ...INITIAL_STATE,
      sessionStarted: true
    });
  });
});
