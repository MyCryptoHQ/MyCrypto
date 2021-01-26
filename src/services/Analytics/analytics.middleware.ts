import { Action, Dispatch, Middleware } from '@reduxjs/toolkit';

import { addAccounts, decrypt, encrypt } from '@store';

import { trackEvent } from './saga';

// Prefer middleware to track events throughout the app.
// ie. https://medium.com/@mwq27/using-redux-middleware-for-simpler-analytics-and-event-tracking-aa22cd996407
const analyticsMiddleware: Middleware<TObject, any, Dispatch<Action>> = (state) => (next) => (
  action
) => {
  switch (action.type) {
    case addAccounts.type: {
      state.dispatch(
        trackEvent({
          name: 'Add Account',
          params: { qty: action.payload.length, walletId: action.payload[0].walletId } // multiple add accounts are always of the same type.
        })
      );
      break;
    }
    case encrypt.type: {
      state.dispatch(
        trackEvent({
          name: 'Screen locked'
        })
      );
      break;
    }
    case decrypt.type: {
      state.dispatch(
        trackEvent({
          name: 'Screen unlocked'
        })
      );
      break;
    }
    default:
      next(action);
  }
};

export default analyticsMiddleware;
