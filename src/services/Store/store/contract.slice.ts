import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContract, LSKeys, NetworkId, TAddress, TUuid } from '@types';
import { isSameAddress } from '@utils';
import { findIndex, propEq } from '@vendor';

import { getAssets } from './asset.slice';
import { selectContacts } from './contact.slice';
import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.CONTRACTS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContract>) {
      state.push(action.payload);
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    }
  }
});

export const { create: createContract, destroy: destroyContract } = slice.actions;
export const selectContracts = createSelector(getAppState, (s) => s.contracts);

export const getContractName = (networkId: NetworkId, address?: TAddress) =>
  createSelector([selectContracts, selectContacts, getAssets], (contracts, contacts, assets) => {
    if (!address) {
      return undefined;
    }
    const contact = contacts.find(
      (c) => isSameAddress(c.address as TAddress, address) && c.network === networkId
    );
    if (contact) {
      return contact.label;
    }
    const contract = contracts.find(
      (c) => isSameAddress(c.address as TAddress, address) && c.networkId === networkId
    );
    if (contract) {
      return contract.name;
    }
    const asset = assets.find(
      (a) =>
        a.contractAddress &&
        isSameAddress(a.contractAddress as TAddress, address) &&
        a.networkId === networkId
    );
    return asset && asset.name;
  });

export default slice;
