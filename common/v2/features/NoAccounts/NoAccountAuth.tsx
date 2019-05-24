import React from 'react';
// import { AccountContext } from 'v2/providers';
import { readAll } from 'v2/services';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  [key: string]: any;
}

export default function PrivateRoute({ component: Component, ...rest }: PrivateRouteProps) {
  const allAccounts = readAll('accounts')();
  return (
    <Route
      {...rest}
      render={props =>
        allAccounts === undefined || allAccounts.length === 0 ? (
          <Redirect to="/no-accounts" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
