import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { Layout } from 'v2/features/Layout';
import { Home, PageNotFound, ScreenLockProvider, DrawerProvider } from 'v2/features';
import { ScrollToTop } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config/routePaths';
import {
  APP_ROUTES,
  PageVisitsAnalytics,
  LegacyRoutesHandler,
  DefaultHomeHandler,
  PrivateRoute
} from 'v2/routing';
import { SPACING } from 'v2/theme';

const layoutConfig = (path: string) => {
  switch (path) {
    case ROUTE_PATHS.HOME.path:
    case ROUTE_PATHS.ROOT.path:
      return {
        centered: false,
        fluid: true,
        fullW: true,
        bgColor: '#fff'
      };
    case ROUTE_PATHS.DASHBOARD.path:
      return {
        centered: true,
        paddingV: SPACING.MD
      };
    default:
      return {
        centered: true,
        paddingV: SPACING.XL
      };
  }
};

const LayoutWithLocation = withRouter(({ location, children }) => {
  return <Layout config={layoutConfig(location.pathname)}>{children}</Layout>;
});

export const AppRoutes = () => {
  return (
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
  );
};
