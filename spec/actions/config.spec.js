import { CHANGE_LANGUAGE, CONFIG_LANGUAGE_CHANGE } from '../../common/actions/config';

describe('actions', () => {
    it('should create an action to change language to index', () => {
        const value = { name: 'English', sign: 'en' };
        const expectedAction = {
            type: CONFIG_LANGUAGE_CHANGE,
            value
        };
        expect(CHANGE_LANGUAGE(value)).toEqual(expectedAction);
    });
});
