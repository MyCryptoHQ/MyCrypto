import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeLatest } from 'redux-saga/effects';

import {
  AssetBalanceObject,
  ExtendedAsset,
  IAccount,
  IProvidersMappings,
  LSKeys,
  TUuid
} from '@types';
import { findIndex, propEq } from '@vendor';

import { getAssetByUUID } from './asset.slice';
import { getAppState } from './selectors';
import { addAccountsToFavorites, getIsDemoMode } from './settings.slice';

export const initialState = [] as IAccount[];

const sliceName = LSKeys.ACCOUNTS;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<IAccount>) {
      state.push(action.payload);
    },
    createMany(state, action: PayloadAction<IAccount[]>) {
      action.payload.forEach((a) => {
        state.push(a);
      });
    },
    resetAndCreate(_, action: PayloadAction<IAccount>) {
      return [action.payload];
    },
    resetAndCreateMany(_, action: PayloadAction<IAccount[]>) {
      return action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<IAccount>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    },
    updateMany(state, action: PayloadAction<IAccount[]>) {
      const accounts = action.payload;
      accounts.forEach((account) => {
        const idx = findIndex(propEq('uuid', account.uuid), state);
        state[idx] = account;
      });
    },
    updateAssets(state, action: PayloadAction<Record<string, AssetBalanceObject[]>>) {
      const accounts = action.payload;
      Object.entries(accounts).forEach(([uuid, assets]) => {
        const idx = findIndex(propEq('uuid', uuid), state);
        state[idx].assets = assets;
      });
    },
    reset() {
      return initialState;
    }
  }
});

export const {
  create: createAccount,
  createMany: createAccounts,
  resetAndCreate: resetAndCreateAccount,
  resetAndCreateMany: resetAndCreateManyAccounts,
  destroy: destroyAccount,
  update: updateAccount,
  updateMany: updateAccounts,
  reset: resetAccount,
  updateAssets: updateAccountAssets
} = slice.actions;

export default slice;

/**
 * Selectors
 */
export const getAccounts = createSelector([getAppState], (s) => {
  const accounts = s[slice.name];
  return accounts?.map((a) => ({
    ...a,
    transactions: a.transactions?.map((t) => ({
      ...t,
      value: EthersBN.from(t.value),
      gasLimit: EthersBN.from(t.gasLimit),
      gasPrice: EthersBN.from(t.gasPrice),
      gasUsed: t.gasUsed && EthersBN.from(t.gasUsed)
    }))
  }));
});
export const getAccountsAssets = createSelector([getAccounts, (s) => s], (a, s) =>
  a
    .flatMap((a) => a.assets)
    .reduce((acc, asset) => [...acc, getAssetByUUID(asset.uuid)(s)!], [] as ExtendedAsset[])
);

export const getAccountsAssetsMappings = createSelector([getAccountsAssets], (assets) =>
  assets.reduce(
    (acc, a) => ({ ...acc, [a.uuid]: a.mappings }),
    {} as Record<string, IProvidersMappings>
  )
);

/**
 * Actions
 */
export const addAccounts = createAction<IAccount[]>(`${slice.name}/addAccounts`);

/**
 * Sagas
 */
export function* accountsSaga() {
  yield takeLatest(addAccounts.type, handleAddAccounts);
}

export function* handleAddAccounts({ payload }: PayloadAction<IAccount[]>) {
  const isDemoMode = yield select(getIsDemoMode);
  // This is where demo mode is disabled when adding new accounts.
  if (isDemoMode) {
    yield put(slice.actions.resetAndCreateMany(payload));
    yield put(addAccountsToFavorites(payload.map(({ uuid }) => uuid)));
  } else {
    yield put(slice.actions.createMany(payload));
    yield put(addAccountsToFavorites(payload.map(({ uuid }) => uuid)));
  }
}
