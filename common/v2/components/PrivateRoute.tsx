import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AccountContext } from 'v2/providers';
import { Layout } from 'v2/features';

interface PrivateRouteProps {
  [key: string]: any;
}

export default function PrivateRoute({ component: Component, ...rest }: PrivateRouteProps) {
  const { accounts } = useContext(AccountContext);

  return (
    <Route
      {...rest}
      render={props =>
        accounts ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to="/no-accounts" />
        )
      }
    />
  );
}
