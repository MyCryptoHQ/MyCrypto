import {CHANGE_LANGUAGE, CONFIG_LANGUAGE_CHANGE} from '../../common/actions/config';

describe('actions', () => {
  it('should create an action to change language to index', () => {
    const index = 2
    const expectedAction = {
      type: CONFIG_LANGUAGE_CHANGE,
      index
    }
    expect(CHANGE_LANGUAGE(index)).toEqual(expectedAction)
  })
})