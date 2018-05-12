import { startOnboardSession, resumeSlide, decrementSlide, incrementSlide } from './actions';

describe('onboardStatus actions', () => {
  it('should create an action to start onboard session', () => {
    const expectedAction = {
      type: 'START_ONBOARD_SESSION'
    };
    expect(startOnboardSession()).toEqual(expectedAction);
  });

  it('should create an action to resume slide', () => {
    const expectedAction = {
      type: 'RESUME_SLIDE',
      slideNumber: 3
    };
    expect(resumeSlide(3)).toEqual(expectedAction);
  });

  it('should create an action to decrement slide', () => {
    const expectedAction = {
      type: 'DECREMENT_SLIDE'
    };
    expect(decrementSlide()).toEqual(expectedAction);
  });

  it('should create an action to increment slide', () => {
    const expectedAction = {
      type: 'INCREMENT_SLIDE'
    };
    expect(incrementSlide()).toEqual(expectedAction);
  });
});
