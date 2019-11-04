import React from 'react';
import { HashRouter, BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

import { Layout } from 'features/Layout';
import { Home, PageNotFound, ScreenLockProvider, DrawerProvider } from 'features';
import { IS_PROD, IS_DOWNLOADABLE, ScrollToTop } from 'utils';
import { ROUTE_PATHS } from 'config/routePaths';
import {
  APP_ROUTES,
  PageVisitsAnalytics,
  LegacyRoutesHandler,
  DefaultHomeHandler,
  PrivateRoute
} from 'routing';

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
              </DefaultHomeHandler>
            </PageVisitsAnalytics>
            <LegacyRoutesHandler />
          </DrawerProvider>
        </ScreenLockProvider>
      </>
    </Router>
  );
};
