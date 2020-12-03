import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_NETWORK } from '@config';
import { DataStore, LSKeys, Network, NetworkId } from '@types';
import { find, findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';

const sliceName = LSKeys.NETWORKS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<Network>) {
      state.push(action.payload);
    },
    createMany(state, action: PayloadAction<Network[]>) {
      action.payload.forEach((a) => {
        state.push(a);
      });
    },
    destroy(state, action: PayloadAction<NetworkId>) {
      const idx = findIndex(propEq('id', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<Network>) {
      const idx = findIndex(propEq('id', action.payload.id), state);
      state[idx] = action.payload;
    },
    updateMany(state, action: PayloadAction<Network[]>) {
      const network = action.payload;
      network.forEach((network) => {
        const idx = findIndex(propEq('id', network.id), state);
        state[idx] = network;
      });
    },
    reset() {
      return initialState;
    }
  }
});

export const {
  create: createNetwork,
  createMany: createNetworks,
  destroy: destroyNetwork,
  update: updateNetwork,
  updateMany: updateNetworks,
  reset: resetNetwork
} = slice.actions;

export default slice;

/**
 * Selectors
 */

const getAppState = (state): DataStore => state.legacy;
export const getNetworks = createSelector([getAppState], (s) => s[slice.name]);
export const getDefaultNetwork = createSelector(getNetworks, find(propEq('id', DEFAULT_NETWORK)));
