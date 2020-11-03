import { combineReducers } from '@reduxjs/toolkit';

import accountSlice from './account.slice';
import assetSlice from './asset.slice';

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

export { serializeEntitiesMiddleware } from './serializeEntities.middleware';

export default combineReducers({
  [accountSlice.name]: accountSlice.reducer,
  [assetSlice.name]: assetSlice.reducer
});
