import { AnyAction } from 'redux';
import { mockStore } from 'test-utils';

import { fAssets } from '@fixtures';

import {
  initialState as assetsInitialState,
  default as assetSlice,
  createAssets
} from './asset.slice';
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
  return mockStore(
    { [slice.name]: slice.reducer(sliceState, action) },
    { [assetSlice.name]: assetSlice.reducer(assetsInitialState, createAssets(fAssets)) }
  );
};

describe('ratesSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('trackAsset(): track an asset', () => {
    const assetToTrack = fAssets[0];
    const actual = reducer(initialState, trackAsset(assetToTrack.uuid));
    expect(actual).toEqual([assetToTrack.uuid]);
  });

  it('getTrackedAssets(): gets all tracked assets', () => {
    const assetToTrack = fAssets[0];
    const actual = combinedReducers(initialState, trackAsset(assetToTrack.uuid));
    expect(getTrackedAssets(actual)).toEqual([assetToTrack]);
  });
});
