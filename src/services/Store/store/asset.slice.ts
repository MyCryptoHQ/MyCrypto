import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { EXCLUDED_ASSETS } from '@config';
import { MyCryptoApiService } from '@services';
import { ExtendedAsset, LSKeys, Network, TUuid } from '@types';
import { filter, find, findIndex, map, mergeRight, pipe, propEq, toPairs } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { appReset } from './root.reducer';
import { getAppState } from './selectors';

const sliceName = LSKeys.ASSETS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedAsset>) {
      state.push(action.payload);
    },
    createMany(state, action: PayloadAction<ExtendedAsset[]>) {
      action.payload.forEach((a) => {
        state.push(a);
      });
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<ExtendedAsset>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    },
    updateMany(state, action: PayloadAction<ExtendedAsset[]>) {
      const assets = action.payload;
      assets.forEach((asset) => {
        const idx = findIndex(propEq('uuid', asset.uuid), state);
        state[idx] = asset;
      });
    },
    addFromAPI(state, action: PayloadAction<Record<string, ExtendedAsset>>) {
      const currentAssets = state.reduce(
        (acc, a: ExtendedAsset) => ({ ...acc, [a.uuid]: a }),
        {} as Record<string, ExtendedAsset>
      );
      const mergeAssets = pipe(
        (assets: Record<TUuid, ExtendedAsset>) => mergeRight(currentAssets, assets),
        toPairs,
        // Asset API returns certain assets we don't want to show in the UI (as their balance is infinity)
        filter(([uuid, _]) => !EXCLUDED_ASSETS.includes(uuid)),
        map(([uuid, a]) => ({ ...a, uuid } as ExtendedAsset))
      );
      return mergeAssets(action.payload);
    },
    reset() {
      return initialState;
    }
  }
});

export const fetchAssets = createAction(`${slice.name}/fetchAssets`);

export const {
  create: createAsset,
  createMany: createAssets,
  destroy: destroyAsset,
  update: updateAsset,
  updateMany: updateAssets,
  addFromAPI: addAssetsFromAPI,
  reset: resetAsset
} = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getAssets = createSelector([getAppState], (s) => s[slice.name]);
export const getBaseAssetByNetwork = (network: Network) =>
  createSelector(getAssets, find(propEq('uuid', network.baseAsset)));
export const getAssetByUUID = (uuid: TUuid) =>
  createSelector([getAssets], (a) => a.find((asset) => asset.uuid === uuid));

/**
 * Sagas
 */
export function* assetSaga() {
  yield all([
    takeLatest(fetchAssets.type, fetchAssetsWorker),
    // Trigger fetching assets on appReset, is dispatched when resetting and importing new settings
    takeLatest(appReset.type, fetchAssetsWorker)
  ]);
}

export function* fetchAssetsWorker() {
  const fetchedAssets = yield call(MyCryptoApiService.instance.getAssets);

  yield put(slice.actions.addFromAPI(fetchedAssets));
}
