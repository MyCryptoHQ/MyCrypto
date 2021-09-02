import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { OpenSeaCollection, OpenSeaNFT, OpenSeaService } from '@services/ApiService/OpenSea';
import { NetworkId, StoreAccount } from '@types';
import { mapAsync } from '@utils';
import { findIndex, propEq } from '@vendor';

import { getAccounts } from './account.slice';
import { AppState } from './root.reducer';

const NFT_NETWORKS = ['Ethereum'] as NetworkId[];

const sliceName = 'nft';

export interface NFTState {
  collections: OpenSeaCollection[];
  nfts: OpenSeaNFT[];
  error?: string;
}

export const initialState = {
  collections: [] as OpenSeaCollection[],
  nfts: [] as OpenSeaNFT[],
  error: undefined
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNFTs(state, action: PayloadAction<OpenSeaNFT[]>) {
      state.nfts = action.payload;
    },
    setCollections(state, action: PayloadAction<OpenSeaCollection[]>) {
      state.collections = action.payload;
    },
    createNFT(state, action: PayloadAction<OpenSeaNFT>) {
      state.nfts.push(action.payload);
    },
    createManyNFTs(state, action: PayloadAction<OpenSeaNFT[]>) {
      action.payload.forEach((a) => {
        state.nfts.push(a);
      });
    },
    destroyNFT(state, action: PayloadAction<number>) {
      const idx = findIndex(propEq('id', action.payload), state.nfts);
      state.nfts.splice(idx, 1);
    },
    createCollection(state, action: PayloadAction<OpenSeaCollection>) {
      state.collections.push(action.payload);
    },
    createManyCollections(state, action: PayloadAction<OpenSeaCollection[]>) {
      action.payload.forEach((a) => {
        state.collections.push(a);
      });
    },
    reset() {
      return initialState;
    }
  }
});

export const fetchNFTs = createAction(`${slice.name}/fetch`);

export const {
  setNFTs,
  setCollections,
  createNFT,
  createManyNFTs,
  reset: resetAsset
} = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getSlice = createSelector(
  (s: AppState) => s.nft,
  (s) => s
);
export const getNFTs = createSelector([getSlice], (slice) => slice.nfts);
export const getCollections = createSelector([getSlice], (slice) => slice.collections);

/**
 * Sagas
 */
export function* nftSaga() {
  yield all([takeLatest(fetchNFTs.type, fetchAssetsWorker)]);
}

export function* fetchAssetsWorker() {
  const accounts: StoreAccount[] = yield select(getAccounts);

  const filteredAccounts = accounts.filter((a) => NFT_NETWORKS.includes(a.networkId));
  const addresses = filteredAccounts.map((a) => a.address);

  const collections: OpenSeaCollection[][] = yield call(
    mapAsync,
    addresses,
    OpenSeaService.fetchCollections
  );

  // @todo Proxy image urls
  // @todo Pagination?
  const nfts: OpenSeaNFT[][] = yield call(mapAsync, addresses, OpenSeaService.fetchAssets);

  yield put(setNFTs(nfts.filter((r) => r !== null).flat()));
  yield put(setCollections(collections.filter((r) => r !== null).flat()));
}
