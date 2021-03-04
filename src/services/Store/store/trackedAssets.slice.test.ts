import { AnyAction } from 'redux';
import { mockAppState } from 'test-utils';

import { fAssets } from '@fixtures';

import {
  getTrackedAssets,
  initialState,
  default as slice,
  trackAsset
} from './trackedAssets.slice';

const reducer = slice.reducer;

const combinedReducers = (
  sliceState: ReturnType<typeof slice.reducer> | undefined,
  action: AnyAction
) => {
  return mockAppState({
    [slice.name]: slice.reducer(sliceState, action)
  });
};

describe('ratesSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('trackAsset(): track an asset', () => {
    const assetToTrack = fAssets[0];
    const actual = reducer(initialState, trackAsset(assetToTrack));
    expect(actual).toEqual([assetToTrack]);
  });

  it('getTrackedAssets(): gets all tracked assets', () => {
    const assetToTrack = fAssets[0];
    const actual = combinedReducers(initialState, trackAsset(assetToTrack));
    expect(getTrackedAssets(actual)).toEqual([assetToTrack]);
  });
});
