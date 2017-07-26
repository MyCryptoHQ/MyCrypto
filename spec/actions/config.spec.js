import { changeLanguage } from '../../common/actions/config';

describe('actions', () => {
  it('should create an action to change language to index', () => {
    const language = 'en';
    const expectedAction = {
      type: 'CONFIG_LANGUAGE_CHANGE',
      language
    };
    expect(changeLanguage(language)).toEqual(expectedAction);
  });
});
