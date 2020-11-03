import { Action, Dispatch, Middleware } from '@reduxjs/toolkit';

import { map } from '@vendor';

import { default as actionSlice } from './account.slice';
import { serializeAccount } from './helpers';

/**
 * 2020-11-02: BN and bignumber objects are not serializable so the @reduxjs/toolkit
 * serializableCheck middleware from `getDefaultMiddleware` throws an error (in dev env).
 * We create a custom middleware that runs before it to convert the bigish values to string.
 */

export const serializeEntitiesMiddleware: Middleware<TObject, any, Dispatch<Action>> = (_) => (
  next
) => (action) => {
  switch (action.type) {
    case actionSlice.actions.create.type:
    case actionSlice.actions.update.type:
      next({ type: action.type, payload: serializeAccount(action.payload) });
      break;
    // Payload is an array of accounts
    case actionSlice.actions.updateMany.type:
      next({
        type: action.type,
        payload: map(serializeAccount, action.payload)
      });
      break;
    default:
      next(action);
  }
};
