import { changeLanguage, CONFIG_META } from './';

describe('actions', () => {
  it('should create an action to change language to index', () => {
    const value = 'en';
    const expectedAction = {
      type: CONFIG_META.LANGUAGE_CHANGE,
      payload: value
    };
    expect(changeLanguage(value)).toEqual(expectedAction);
  });
});
