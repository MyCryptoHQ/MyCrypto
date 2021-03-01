import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContact, LSKeys, TUuid } from '@types';
import { generateUUID } from '@utils';
import { find, findIndex, prop, propEq, uniqBy } from '@vendor';

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
    }
  }
});

export const {
  create: createContact,
  destroy: destroyContact,
  update: updateContact,
  createOrUpdate: createOrUpdateContact
} = slice.actions;

export const selectContacts = createSelector(getAppState, (s) => s[slice.name]);
export const selectContact = (uuid: TUuid) =>
  createSelector(selectContacts, find(propEq('uuid', uuid)));

export default slice;
