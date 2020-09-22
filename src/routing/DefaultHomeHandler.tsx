import React, { useContext } from 'react';

import { withRouter } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { ScreenLockContext } from '@features';
import { useAccounts } from '@services/Store';

export const DefaultHomeHandler = withRouter(({ history, children }) => {
  const { accounts } = useAccounts();
  const { locked } = useContext(ScreenLockContext);

  const path = history.location.pathname;
  if (path === ROUTE_PATHS.ROOT.path) {
    if (accounts.length > 0 || locked) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      history.push(ROUTE_PATHS.ADD_ACCOUNT.path);
    }
  }
  return <React.Fragment>{children}</React.Fragment>;
});
