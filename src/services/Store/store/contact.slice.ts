import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContact, IAccount, LSKeys, TAddress, TUuid } from '@types';
import { generateUUID, isSameAddress } from '@utils';
import { findIndex, prop, propEq, uniqBy } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.ADDRESS_BOOK;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContact>) {
      state.push(action.payload);
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<ExtendedContact>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    },
    createOrUpdate: {
      reducer: (state, action: PayloadAction<ExtendedContact>) => {
        return uniqBy(prop('uuid'), [action.payload, ...state]);
      },
      prepare: ({ uuid = generateUUID(), notes = '', ...rest }) => {
        return {
          payload: {
            uuid,
            notes,
            ...rest
          }
        };
      }
    },
    createOrUpdateMultiple(state, action: PayloadAction<ExtendedContact[]>) {
      return uniqBy(prop('uuid'), [...action.payload, ...state]);
    }
  }
});

export const {
  create: createContact,
  destroy: destroyContact,
  update: updateContact,
  createOrUpdate: createOrUpdateContact,
  createOrUpdateMultiple: createOrUpdateContacts
} = slice.actions;

export const selectContacts = createSelector(getAppState, (s) => s.addressBook);
export const selectContact = (uuid: TUuid) =>
  createSelector(selectContacts, (contacts) => contacts.find((c) => c.uuid === uuid));

export const selectAccountContact = (account: IAccount) =>
  createSelector(selectContacts, (contacts) =>
    contacts.find(
      (contact) =>
        isSameAddress(account.address, contact.address as TAddress) &&
        account.networkId === contact.network
    )
  );

export default slice;
