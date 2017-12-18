import * as actions from '../../common/actions/onboardStatus';

describe('onboardStatus actions', () => {
  it('should create an action to change language to index', () => {
    const expectedAction = {
      type: 'START_ONBOARD_ACTION'
    };
    expect(actions.startOnboardSession()).toEqual(expectedAction);
  });
});
