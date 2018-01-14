import * as actions from '../../common/actions/onboardStatus';

describe('onboardStatus actions', () => {
  it('should create an action to start onboard session', () => {
    const expectedAction = {
      type: 'START_ONBOARD_SESSION'
    };
    expect(actions.startOnboardSession()).toEqual(expectedAction);
  });

  it('should create an action to resume slide', () => {
    const expectedAction = {
      type: 'RESUME_SLIDE',
      slideNumber: 3
    };
    expect(actions.resumeSlide(3)).toEqual(expectedAction);
  });

  it('should create an action to decrement slide', () => {
    const expectedAction = {
      type: 'DECREMENT_SLIDE'
    };
    expect(actions.decrementSlide()).toEqual(expectedAction);
  });

  it('should create an action to increment slide', () => {
    const expectedAction = {
      type: 'INCREMENT_SLIDE'
    };
    expect(actions.incrementSlide()).toEqual(expectedAction);
  });
});
