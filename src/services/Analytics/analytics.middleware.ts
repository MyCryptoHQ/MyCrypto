import { Action, Dispatch, Middleware } from '@reduxjs/toolkit';

import {
  addNewAccounts,
  createAsset,
  importState,
  setDemoMode,
  setProductAnalyticsAuthorisation
} from '@store';

import { trackEvent } from './saga';

// Prefer middleware to track events throughout the app.
// ie. https://medium.com/@mwq27/using-redux-middleware-for-simpler-analytics-and-event-tracking-aa22cd996407
// Since this the dispatch is tested it is removed from codecov stats:
export const analyticsMiddleware: Middleware<TObject, any, Dispatch<Action>> = (state) => (
  next
) => (action) => {
  switch (action.type) {
    case addNewAccounts.type: {
      state.dispatch(
        trackEvent({
<<<<<<< HEAD
          name: 'Add Account',
          params: {
            qty: action.payload.newAccounts.length,
            // multiple add accounts are always of the same type and network
            walletId: action.payload.accountType,
            networkId: action.payload.networkId
          }
=======
          action: 'Add Account'
          /*params: {
            qty: action.payload.length,
            // multiple add accounts are always of the same type and network
            walletId: action.payload[0].wallet,
            networkId: action.payload[0].networkId
          }*/
>>>>>>> Improve analytics events for Matomo
        })
      );
      break;
    }
    // Track custom token creation. Is also triggered on custom network.
    case createAsset.type: {
      state.dispatch(
        trackEvent({
          action: 'Add Asset'
          //params: action.payload
        })
      );
      break;
    }

    case setDemoMode.type: {
      state.dispatch(
        trackEvent({
          action: 'Set Demo Mode'
        })
      );
      break;
    }

    case setProductAnalyticsAuthorisation.type: {
      state.dispatch(
        trackEvent({
          action: 'Deactivate analytics'
        })
      );
      break;
    }

    case importState.type: {
      state.dispatch(trackEvent({ action: 'Import AppState' }));
      break;
    }

    default:
      // do nothing;
      break;
  }
  return next(action);
};
