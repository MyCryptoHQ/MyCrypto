import { mockStore } from 'test-utils';

import { fAccount, fAccounts, fAssets, fDAI, fValidNetworks } from '@fixtures';

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

  it('selectFormAsset(): if exists returns the asset from slice', () => {
    const stateSlice = reducer({ selectedAsset: fDAI }, { type: null });
    const state = mockStore({ storeSlice: { [slice.name]: stateSlice } });
    const actual = selectFormAsset(state);
    const expected = fDAI;
    expect(actual).toEqual(expected);
  });

  it('selectFormAsset(): else retrieves the first user asset', () => {
    const stateSlice = reducer(undefined, { type: null });
    const state = mockStore({
      storeSlice: { [slice.name]: stateSlice },
      dataStoreState: { accounts: [fAccount], networks: fValidNetworks }
    });
    const actual = selectFormAsset(state);
    const expected = fAccount.assets[0];
    expect(actual).toEqual(expected);
  });

  it('selectFormAsset(): otherwise returns ETH', () => {
    const stateSlice = reducer(undefined, { type: null });
    const state = mockStore({
      storeSlice: { [slice.name]: stateSlice },
      dataStoreState: { accounts: fAccounts, networks: fValidNetworks }
    });
    const actual = selectFormAsset(state);
    const expected = fAssets[0];
    expect(actual).toMatchObject(expected);
  });
});
