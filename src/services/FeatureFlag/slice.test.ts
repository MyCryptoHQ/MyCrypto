import {
  FeatureFlag,
  initialState,
  resetFeatureFlags,
  setFeatureFlag,
  default as slice
} from './slice';

const reducer = slice.reducer;

describe('FeatureFlagsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('set(): can set it to false', () => {
    const action = { feature: 'FAUCET' as FeatureFlag, isActive: false };
    const actual = reducer(undefined, setFeatureFlag(action));
    const expected = { ...initialState, FAUCET: false };
    expect(actual).toEqual(expected);
  });

  it('resetFeatureFlags(): can reset all feature flags', () => {
    const action = { feature: 'FAUCET' as FeatureFlag, isActive: false };
    const intermediate = reducer(undefined, setFeatureFlag(action));
    const actual = reducer(intermediate, resetFeatureFlags());
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
});
