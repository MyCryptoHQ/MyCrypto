import { onboardStatus, INITIAL_STATE } from 'reducers/onboardStatus';
import * as onboardStatusActions from 'actions/onboardStatus';

describe('onboardStatus reducer', () => {
  it('should handle START_ONBOARD_STATUS', () => {
    expect(onboardStatus(undefined, onboardStatusActions.startOnboardSession())).toEqual({
      ...INITIAL_STATE,
      sessionStarted: true
    });
  });
});
