import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { AccountContext } from '@services/Store';

interface PrivateRouteProps {
  [key: string]: any;
}

export const PrivateRoute = ({
  component: Component,
  requireAccounts,
  ...rest
}: PrivateRouteProps) => {
  const { accounts } = useContext(AccountContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        (accounts && accounts.length) || !requireAccounts ? (
          <Component {...props} />
        ) : (
          <Redirect to={ROUTE_PATHS.NO_ACCOUNTS.path} />
        )
      }
    />
  );
};
