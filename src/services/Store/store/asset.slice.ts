import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { EXCLUDED_ASSETS } from '@config';
import { MyCryptoApiService } from '@services';
import { ExtendedAsset, LSKeys, Network, NetworkId, StoreAsset, TUuid } from '@types';
import { arrayToObj } from '@utils';
import { filter, findIndex, map, mergeRight, pipe, propEq, toPairs } from '@vendor';

import { getAccountsAssets } from './account.slice';
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
    addFromAPI(_state, action: PayloadAction<ExtendedAsset[]>) {
      // Sets the state directly since the payload is merged in the saga
      return action.payload;
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

export const getAssets = createSelector([getAppState], (s) => s.assets);
export const getAssetsByNetwork = (network: NetworkId) =>
  createSelector(getAssets, (assets) => assets.filter((asset) => asset.networkId === network));
export const getBaseAssetByNetwork = (network: Network) =>
  createSelector(getAssets, (assets) => assets.find((asset) => asset.uuid === network.baseAsset)!);
export const getAssetByUUID = (uuid: TUuid) =>
  createSelector([getAssets], (a) => a.find((asset) => asset.uuid === uuid));

export const getCoinGeckoAssetManifest = createSelector(getAssets, (assets) =>
  assets.filter((a) => a.mappings?.coinGeckoId).map((a) => a.uuid)
);

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

  const lsAssets: ExtendedAsset[] = yield select(getAssets);
  const accountAssets: StoreAsset[] = yield select(getAccountsAssets);
  const currentAssets = arrayToObj('uuid')(
    lsAssets.filter(
      (a) =>
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        a.isCustom ||
        a.type === 'base' ||
        accountAssets.some((accAsset) => accAsset.uuid === a.uuid && accAsset.balance.gt(0))
    )
  );
  const mergeAssets = pipe(
    (assets: Record<TUuid, ExtendedAsset>) => mergeRight(currentAssets, assets),
    toPairs,
    // Asset API returns certain assets we don't want to show in the UI (as their balance is infinity)
    filter(([uuid, _]) => !EXCLUDED_ASSETS.includes(uuid)),
    map(([uuid, a]) => ({ ...a, uuid } as ExtendedAsset))
  );
  const merged = mergeAssets(fetchedAssets);

  yield put(slice.actions.addFromAPI(merged));
}
