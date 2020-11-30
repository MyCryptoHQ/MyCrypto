import { initialState, default as slice } from './password.slice';

const reducer = slice.reducer;
const { set, reset } = slice.actions;

describe('Password', () => {
  it('has an initialState', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('set(): adds a password to state', () => {
    const pwd = 'my-secret';
    const actual = reducer(undefined, set(pwd));
    expect(actual).toEqual(pwd);
  });

  it('reset(): resets slice to initial state', () => {
    const state = 'my-old-secret';
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });
});
