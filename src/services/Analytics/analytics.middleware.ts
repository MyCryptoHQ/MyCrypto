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
      // multiple add accounts are always of the same type and network
      action.payload.newAccounts.forEach(() => {
        state.dispatch(
          trackEvent({
            action: 'Add Account',
            customDimensions: [
              {
                id: 1,
                value: action.payload.accountType
              },
              {
                id: 2,
                value: action.payload.networkId
              }
            ]
          })
        );
      });
      break;
    }
    // Track custom token creation. Is also triggered on custom network.
    case createAsset.type: {
      state.dispatch(
        trackEvent({
          action: 'Add Asset',
          name: action.payload.ticker,
          customDimensions: action.payload.contractAddress
            ? [
                {
                  id: 3,
                  value: action.payload.contractAddress
                }
              ]
            : []
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
