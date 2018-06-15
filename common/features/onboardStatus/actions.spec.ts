import * as onboardStatusActions from './actions';

describe('onboardStatus actions', () => {
  it('should create an action to start onboard session', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_START_SESSION'
    };
    expect(onboardStatusActions.startOnboardSession()).toEqual(expectedAction);
  });

  it('should create an action to resume slide', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_RESUME_SLIDE',
      slideNumber: 3
    };
    expect(onboardStatusActions.resumeSlide(3)).toEqual(expectedAction);
  });

  it('should create an action to decrement slide', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_DECREMENT_SLIDE'
    };
    expect(onboardStatusActions.decrementSlide()).toEqual(expectedAction);
  });

  it('should create an action to increment slide', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_INCREMENT_SLIDE'
    };
    expect(onboardStatusActions.incrementSlide()).toEqual(expectedAction);
  });
});
