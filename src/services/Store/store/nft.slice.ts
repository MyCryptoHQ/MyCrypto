import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { OpenSeaCollection, OpenSeaNFT, OpenSeaService } from '@services/ApiService/OpenSea';
import { NetworkId, StoreAccount } from '@types';
import { mapAsync } from '@utils';
import { prop, uniqBy } from '@vendor';

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
    fetchError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export const fetchNFTs = createAction(`${slice.name}/fetch`);

export const { setFetched, setNFTs, setCollections, fetchError } = slice.actions;

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
export const getCollections = createSelector([getSlice], (slice) => slice.collections);
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
    return acc + (collection.stats.floor_price ?? 0) * nfts.length;
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
    const collections: OpenSeaCollection[][] = yield call(
      mapAsync,
      addresses,
      OpenSeaService.fetchCollections
    );

    // @todo Pagination?
    const nfts: OpenSeaNFT[][] = yield call(mapAsync, addresses, OpenSeaService.fetchAllAssets);

    const assets = nfts.filter((r) => r !== null).flat();

    // @todo Handle error?
    yield call(OpenSeaService.proxyAssets, assets);

    yield put(setNFTs(assets));
    yield put(setCollections(uniqBy(prop('slug'), collections.filter((r) => r !== null).flat())));

    yield put(setFetched(true));
  } catch (err) {
    yield put(fetchError(err.message));
  }
}
