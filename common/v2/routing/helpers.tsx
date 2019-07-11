import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { AccountContext, LockScreenContext } from 'v2/providers';

export const HomepageChoiceRedirect = withRouter(({ history, children }) => {
  const { accounts } = useContext(AccountContext);
  const { locked } = useContext(LockScreenContext);

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
