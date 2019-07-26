import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { ScreenLockContext } from 'v2/providers';
import { AccountContext } from 'v2/services/Store';

export const HomepageChoiceRedirect = withRouter(({ history, children }) => {
  const { accounts } = useContext(AccountContext);
  const { locked } = useContext(ScreenLockContext);

  const path = history.location.pathname;
  if (path === '/') {
    if (accounts.length > 0 || locked) {
      history.push('/dashboard');
    } else {
      history.push('/home');
    }
  }
  return <React.Fragment>{children}</React.Fragment>;
});
