import React from 'react';
import { HashRouter, BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

import { LogOutPrompt } from 'components';
import { BroadcastTx, Contracts, GenerateWallet, SendTransaction, SupportPage } from 'containers';
import { Layout } from 'v2/features/Layout';
import { Home, PageNotFound, ScreenLockProvider, DrawerProvider } from 'v2/features';
import { IS_PROD, IS_DOWNLOADABLE, ScrollToTop } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config';
import {
  APP_ROUTES,
  PageVisitsAnalytics,
  LegacyRoutesHandler,
  DefaultHomeHandler,
  PrivateRoute
} from 'v2/routing';

const LayoutWithLocation = withRouter(({ location, children }) => {
  const homeLayout = {
    centered: false,
    fluid: true,
    fullW: true,
    bgColor: '#fff'
  };
  const isHomeRoute =
    location.pathname === ROUTE_PATHS.ROOT.path || location.pathname === ROUTE_PATHS.HOME.path;
  return <Layout config={isHomeRoute ? homeLayout : {}}>{children}</Layout>;
});

export const AppRouter = () => {
  const Router: any = IS_DOWNLOADABLE && IS_PROD ? HashRouter : BrowserRouter;

  return (
    <Router>
      <>
        <ScrollToTop />
        <ScreenLockProvider>
          <DrawerProvider>
            <PageVisitsAnalytics>
              <DefaultHomeHandler>
                <Switch>
                  {/* To avoid fiddling with layout we provide a complete route to home */}

                  <Route path="/account" component={SendTransaction} exact={true} />
                  <Route path="/generate" component={GenerateWallet} />
                  <Route path="/contracts" component={Contracts} />
                  <Route path="/pushTx" component={BroadcastTx} />
                  <Route path="/support-us" component={SupportPage} exact={true} />
                  <LayoutWithLocation>
                    <Switch>
                      <Route path={ROUTE_PATHS.ROOT.path} component={Home} exact={true} />
                      <Route path={ROUTE_PATHS.HOME.path} component={Home} exact={true} />
                      {APP_ROUTES.filter(route => !route.seperateLayout).map((config, idx) => (
                        <PrivateRoute key={idx} {...config} />
                      ))}
                      <Route component={PageNotFound} />
                    </Switch>
                  </LayoutWithLocation>
                </Switch>
                <LogOutPrompt />
              </DefaultHomeHandler>
            </PageVisitsAnalytics>
            <LegacyRoutesHandler />
          </DrawerProvider>
        </ScreenLockProvider>
      </>
    </Router>
  );
};

// <LayoutWithLocation>
//   <Switch>
//     <Route path={ROUTE_PATHS.ROOT.path} component={Home} exact={true} />
//     {/*
//         The root will redirect to 'dashboard' when the user has an account
//         For debugging purposes we include 'home' route as well
//     */}
//     <Route path={ROUTE_PATHS.HOME.path} component={Home} exact={true} />
//     {APP_ROUTES.filter(route => !route.seperateLayout).map((config, idx) => (
//       <PrivateRoute key={idx} {...config} />
//     ))}
//     <Route component={PageNotFound} />
//   </Switch>
// </LayoutWithLocation>
