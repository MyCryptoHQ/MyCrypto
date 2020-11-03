import { combineReducers } from '@reduxjs/toolkit';

import accountSlice from './account.slice';
import assetSlice from './asset.slice';
import contactSlice from './contact.slice';

export const {
  create: createAccount,
  destroy: destroyAccount,
  update: updateAccount,
  updateMany: updateAccounts,
  reset: resetAccount
} = accountSlice.actions;

export const {
  create: createAsset,
  destroy: destroyAsset,
  update: updateAsset,
  updateMany: updateAssets,
  reset: resetAsset
} = assetSlice.actions;

export const {
  create: createContact,
  destroy: destroyContact,
  update: updateContact,
  updateMany: updateContacts,
  reset: resetContact
} = contactSlice.actions;

export { serializeEntitiesMiddleware } from './serializeEntities.middleware';

export default combineReducers({
  [accountSlice.name]: accountSlice.reducer,
  [assetSlice.name]: assetSlice.reducer,
  [contactSlice.name]: contactSlice.reducer
});
