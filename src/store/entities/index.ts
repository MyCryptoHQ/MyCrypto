import { combineReducers } from '@reduxjs/toolkit';

import accountSlice from './account.slice';

export const {
  create: createAccount,
  destroy: destroyAccount,
  update: updateAccount,
  updateMany: updateAccounts,
  reset: resetAccount
} = accountSlice.actions;

export { serializeEntitiesMiddleware } from './serializeEntities.middleware';

export default combineReducers({ [accountSlice.name]: accountSlice.reducer });
