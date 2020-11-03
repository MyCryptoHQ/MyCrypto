import { combineReducers } from '@reduxjs/toolkit';

import accountSlice from './account.slice';

export const {
  create: createAccount,
  destroy: destroyAccount,
  update: updateAccount,
  updateMany: updateAccounts,
  reset: resetAccount
} = accountSlice.actions;

const slices = combineReducers({ [accountSlice.name]: accountSlice.reducer });
export { serializeEntitiesMiddleware } from './serializeEntities.middleware';

export default slices;
