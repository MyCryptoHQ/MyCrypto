import * as types from './types';
import { changeLanguage } from './actions';

describe('actions', () => {
  it('should create an action to change language to index', () => {
    const value = 'en';
    const expectedAction = {
      type: types.ConfigMetaActions.LANGUAGE_CHANGE,
      payload: value
    };
    expect(changeLanguage(value)).toEqual(expectedAction);
  });
});
