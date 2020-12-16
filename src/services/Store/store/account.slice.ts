import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_NETWORK } from '@config';
import { AssetBalanceObject, IAccount, LSKeys, TUuid, WalletId } from '@types';
import { filter, findIndex, pipe, propEq, reject } from '@vendor';

import { getAppState } from './selectors';

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
      const newState = [] as IAccount[];
      action.payload.forEach((a) => {
        newState.push(a);
      });
      return newState;
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
export const getAccounts = createSelector([getAppState], (s) => s[slice.name]);

export const getWalletAccountsOnDefaultNetwork = createSelector(
  getAccounts,
  pipe(reject(propEq('wallet', WalletId.VIEW_ONLY)), filter(propEq('networkId', DEFAULT_NETWORK)))
);
