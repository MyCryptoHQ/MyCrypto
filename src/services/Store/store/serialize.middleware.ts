import { Action, Dispatch, Middleware } from '@reduxjs/toolkit';

import { map } from '@vendor';

import { createAccount, createAccounts, updateAccount, updateAccounts } from './account.slice';
import { serializeAccount, serializeNotification } from './helpers';
import { createNotification, updateNotification } from './notification.slice';

/**
 * 2020-11-02: BN and bignumber objects are not serializable so the @reduxjs/toolkit
 * serializableCheck middleware from `getDefaultMiddleware` throws an error (in dev env).
 * We create a custom middleware that runs before it to convert the bigish values to string.
 */

export const serializeLegacyMiddleware: Middleware<TObject, any, Dispatch<Action>> = (_) => (
  next
) => (action) => {
  switch (action.type) {
    /** Transform bigish values to string */
    case createAccount.type:
    case updateAccount.type: {
      return next({ type: action.type, payload: serializeAccount(action.payload) });
    }
    // Payload is an array of accounts
    case createAccounts.type:
    case updateAccounts.type: {
      return next({
        type: action.type,
        payload: map(serializeAccount, action.payload)
      });
    }
    /** Transform date formats to string */
    case createNotification.type:
    case updateNotification.type: {
      return next({
        type: action.type,
        payload: serializeNotification(action.payload)
      });
    }
    default:
      return next(action);
  }
};
