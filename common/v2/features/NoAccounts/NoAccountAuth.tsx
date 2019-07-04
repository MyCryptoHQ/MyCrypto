import React, { useContext } from 'react';

import { Layout } from 'v2/features';
import { AccountContext } from 'v2/providers';
import { Route, Redirect } from 'react-router-dom';

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
