import { mockAppState } from 'test-utils';

import { fAssets } from '@fixtures';

import {
  getTrackedAssets,
  initialState,
  default as slice,
  trackAsset
} from './trackedAssets.slice';

const reducer = slice.reducer;

describe('trackedAssetsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('trackAsset(): track an asset', () => {
    const assetToTrack = { ...fAssets[0], mappings: {} };
    const actual = reducer(initialState, trackAsset(assetToTrack));
    expect(actual).toEqual({ [assetToTrack.uuid]: { ...assetToTrack.mappings } });
  });

  it('getTrackedAssets(): gets all tracked assets', () => {
    const assetToTrack = { ...fAssets[0], mappings: {} };
    const actual = mockAppState({
      [slice.name]: reducer(initialState, trackAsset(assetToTrack))
    });
    expect(getTrackedAssets(actual)).toEqual({ [assetToTrack.uuid]: { ...assetToTrack.mappings } });
  });
});
