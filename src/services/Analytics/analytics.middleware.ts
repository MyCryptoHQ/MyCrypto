import { Action, Dispatch, Middleware } from '@reduxjs/toolkit';

import { addAccounts, getAccounts } from '@store';

import { trackEvent } from './saga';

// Prefer middleware to track events throughout the app.
// ie. https://medium.com/@mwq27/using-redux-middleware-for-simpler-analytics-and-event-tracking-aa22cd996407
const analyticsMiddleware: Middleware<TObject, any, Dispatch<Action>> = (state) => (next) => (
  action
) => {
  switch (action.type) {
    case addAccounts.type: {
      const curr = getAccounts(state.getState()).length;
      state.dispatch(
        trackEvent({
          name: 'Add Account',
          params: { before: curr, after: curr + action.payload.length }
        })
      );
      break;
    }
    default:
      next(action);
  }
};

export default analyticsMiddleware;
