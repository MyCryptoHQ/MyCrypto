import { mockAppState } from 'test-utils';

import { initialState, selectPassword, default as slice } from './password.slice';

const reducer = slice.reducer;
const { reset } = slice.actions;

describe('Password', () => {
  it('has an initialState', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('reset(): resets slice to initial state', () => {
    const state = 'my-old-secret';
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });

  it('selectPassword(): selects the correct slice', () => {
    const actual = selectPassword(mockAppState());
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
});
