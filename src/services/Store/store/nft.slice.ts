import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import {
  CustomOpenSeaCollectionStats,
  OpenSeaCollection,
  OpenSeaNFT,
  OpenSeaService
} from '@services/ApiService/OpenSea';
import { NetworkId, StoreAccount } from '@types';
import { mapAsync } from '@utils';
import { prop, uniq, uniqBy } from '@vendor';

import { getAccounts } from './account.slice';
import { AppState } from './root.reducer';

const NFT_NETWORKS = ['Ethereum'] as NetworkId[];

const sliceName = 'nft';

export interface NFTState {
  fetched: boolean;
  collections: OpenSeaCollection[];
  nfts: OpenSeaNFT[];
  error?: string;
}

export const initialState = {
  fetched: false,
  collections: [] as OpenSeaCollection[],
  stats: [] as CustomOpenSeaCollectionStats[],
  nfts: [] as OpenSeaNFT[],
  error: undefined as string | undefined
};

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setFetched(state, action: PayloadAction<boolean>) {
      state.fetched = action.payload;
    },
    setNFTs(state, action: PayloadAction<OpenSeaNFT[]>) {
      state.nfts = action.payload;
    },
    setCollections(state, action: PayloadAction<OpenSeaCollection[]>) {
      state.collections = action.payload;
    },
    setStats(state, action: PayloadAction<CustomOpenSeaCollectionStats[]>) {
      state.stats = action.payload;
    },
    fetchError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export const fetchNFTs = createAction(`${slice.name}/fetch`);

export const { setFetched, setNFTs, setCollections, setStats, fetchError } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getSlice = createSelector(
  (s: AppState) => s.nft,
  (s) => s
);
export const getFetched = createSelector([getSlice], (slice) => slice.fetched);
export const getNFTs = createSelector([getSlice], (slice) => slice.nfts);
export const getCollections = createSelector([getSlice], (slice) =>
  uniqBy(
    prop('slug'),
    slice.nfts.map((n) => ({
      ...n.collection,
      stats: slice.stats.find((s) => s.slug === n.collection.slug)
    }))
  )
);
export const getNFTsByCollection = createSelector([getNFTs, getCollections], (nfts, collections) =>
  collections.map((collection) => ({
    collection,
    nfts: nfts.filter((nft) => nft.collection.slug === collection.slug)
  }))
);
export const getTotalValue = createSelector([getNFTsByCollection], (nftsByCollection) =>
  nftsByCollection.reduce((acc, obj) => {
    const { nfts, collection } = obj;
    // @todo Consider bids?
    return acc + (collection.stats?.floor_price ?? 0) * nfts.length;
  }, 0)
);

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

  try {
    // @todo Pagination?
    const nfts: OpenSeaNFT[][] = yield call(mapAsync, addresses, OpenSeaService.fetchAllAssets);

    const assets = nfts.filter((r) => r !== null).flat();

    const collections = uniq(assets.map((a) => a.collection.slug));

    const stats: CustomOpenSeaCollectionStats[] = yield call(
      mapAsync,
      collections,
      OpenSeaService.fetchCollectionStats
    );

    // @todo Handle error?
    yield call(OpenSeaService.proxyAssets, assets);

    yield put(setNFTs(assets));
    yield put(setStats(stats));

    yield put(setFetched(true));
  } catch (err) {
    yield put(fetchError(err.message));
  }
}
