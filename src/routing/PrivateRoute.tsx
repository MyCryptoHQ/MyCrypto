import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { ROUTE_PATHS } from '@config';
import { useAccounts } from '@services/Store';

interface PrivateRouteProps {
  [key: string]: any;
}

export const PrivateRoute = ({
  component: Component,
  requireAccounts,
  ...rest
}: PrivateRouteProps) => {
  const { accounts } = useAccounts();
  return (
    <Route
      {...rest}
      render={(props) =>
        (accounts && accounts.length) || !requireAccounts ? (
          <Component {...props} />
        ) : (
          <Redirect to={ROUTE_PATHS.ADD_ACCOUNT.path} />
        )
      }
    />
  );
};
