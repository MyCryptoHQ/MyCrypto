import React from 'react';
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';

import { LogOutPrompt } from 'components';
import { BroadcastTx, Contracts, GenerateWallet, SendTransaction, SupportPage } from 'containers';
import { Layout } from 'v2/features/Layout';
import { Home, PageNotFound, ScreenLockProvider, DrawerProvider } from 'v2/features';
import { IS_PROD, IS_DOWNLOADABLE } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config';
import {
  APP_ROUTES,
  PageVisitsAnalytics,
  LegacyRoutesHandler,
  DefaultHomeHandler,
  PrivateRoute
} from 'v2/routing';

export const AppRouter = () => {
  const Router: any = IS_DOWNLOADABLE && IS_PROD ? HashRouter : BrowserRouter;

  return (
    <Router>
      <ScreenLockProvider>
        <DrawerProvider>
          <PageVisitsAnalytics>
            <DefaultHomeHandler>
              <Switch>
                {/* To avoid fiddling with layout we provide a complete route to home */}
                <Route path={ROUTE_PATHS.ROOT.path} component={Home} exact={true} />
                <Route path={ROUTE_PATHS.HOME.path} component={Home} exact={true} />
                <Route path="/account" component={SendTransaction} exact={true} />
                <Route path="/generate" component={GenerateWallet} />
                <Route path="/contracts" component={Contracts} />
                <Route path="/pushTx" component={BroadcastTx} />
                <Route path="/support-us" component={SupportPage} exact={true} />
                <Layout>
                  <Switch>
                    {APP_ROUTES.filter(route => !route.seperateLayout).map((config, idx) => (
                      <PrivateRoute key={idx} {...config} />
                    ))}
                    <Route component={PageNotFound} />
                  </Switch>
                </Layout>
              </Switch>
              <LogOutPrompt />
            </DefaultHomeHandler>
          </PageVisitsAnalytics>
          <LegacyRoutesHandler />
        </DrawerProvider>
      </ScreenLockProvider>
    </Router>
  );
};
