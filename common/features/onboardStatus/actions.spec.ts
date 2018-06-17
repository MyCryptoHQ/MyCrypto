import * as actions from './actions';

describe('onboardStatus actions', () => {
  it('should create an action to start onboard session', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_START_SESSION'
    };
    expect(actions.startOnboardSession()).toEqual(expectedAction);
  });

  it('should create an action to resume slide', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_RESUME_SLIDE',
      slideNumber: 3
    };
    expect(actions.resumeSlide(3)).toEqual(expectedAction);
  });

  it('should create an action to decrement slide', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_DECREMENT_SLIDE'
    };
    expect(actions.decrementSlide()).toEqual(expectedAction);
  });

  it('should create an action to increment slide', () => {
    const expectedAction = {
      type: 'ONBOARD_STATUS_INCREMENT_SLIDE'
    };
    expect(actions.incrementSlide()).toEqual(expectedAction);
  });
});
