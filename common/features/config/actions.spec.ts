import { changeLanguage } from './actions';

describe('actions', () => {
  it('should create an action to change language to index', () => {
    const value = 'en';
    const expectedAction = {
      type: 'CONFIG_LANGUAGE_CHANGE',
      payload: value
    };
    expect(changeLanguage(value)).toEqual(expectedAction);
  });
});
