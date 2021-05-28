import { mockStore } from 'test-utils';

import { fAssets } from '@fixtures';

import {
  initialState,
  selectFormAsset,
  default as slice,
  updateFormAsset
} from './sendAssets.slice';

const { reducer } = slice;

describe('sendAssets.slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('updateFormAsset(): sets the selected asset', () => {
    const actual = reducer({}, updateFormAsset(fAssets[0]));
    const expected = { selectedAsset: fAssets[0] };
    expect(actual).toEqual(expected);
  });

  it('selectFormAsset(): retreives the correct key', () => {
    const stateSlice = reducer({ selectedAsset: fAssets[0] }, { type: null });
    const state = mockStore({ storeSlice: { [slice.name]: stateSlice } });
    const actual = selectFormAsset(state);
    const expected = fAssets[0];
    expect(actual).toEqual(expected);
  });
});
