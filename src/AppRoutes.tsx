import React, { Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { Layout, LayoutConfig } from '@features/Layout';
import { PageNotFound, Dashboard, ScreenLockProvider, DrawerProvider } from '@features';
import { ScrollToTop, useScreenSize } from '@utils';
import { useFeatureFlags } from '@services';
import { ROUTE_PATHS } from '@config';
import {
  PageVisitsAnalytics,
  LegacyRoutesHandler,
  DefaultHomeHandler,
  PrivateRoute,
  getAppRoutes
} from '@routing';
import { COLORS, SPACING } from '@theme';

import { AppLoading } from './AppLoading';

const layoutConfig = (path: string, isMobile: boolean): LayoutConfig => {
  switch (path) {
    case ROUTE_PATHS.ROOT.path:
      return {
        centered: false,
        fluid: true,
        fullW: true,
        bgColor: COLORS.WHITE
      };
    case ROUTE_PATHS.DASHBOARD.path:
      return {
        centered: true,
        paddingV: SPACING.MD
      };
    case ROUTE_PATHS.SETTINGS.path:
      return {
        centered: true,
        fluid: true,
        fullW: true,
        bgColor: COLORS.WHITE,
        paddingV: isMobile ? '0px' : SPACING.MD
      };
    default:
      return {
        centered: true,
        paddingV: SPACING.XL
      };
  }
};

const LayoutWithLocation = withRouter(({ location, children }) => {
  const { isMobile } = useScreenSize();
  return <Layout config={layoutConfig(location.pathname, isMobile)}>{children}</Layout>;
});

export const AppRoutes = () => {
  const { featureFlags } = useFeatureFlags();

  return (
    <>
      <ScrollToTop />
      <ScreenLockProvider>
        <DrawerProvider>
          <PageVisitsAnalytics>
            <DefaultHomeHandler>
              <Suspense fallback={<AppLoading />}>
                <Switch>
                  {/* To avoid fiddling with layout we provide a complete route to home */}
                  <LayoutWithLocation>
                    <Switch>
                      <Route path={ROUTE_PATHS.ROOT.path} component={Dashboard} exact={true} />
                      {getAppRoutes(featureFlags)
                        .filter((route) => !route.seperateLayout)
                        .map((config, idx) => (
                          <PrivateRoute key={idx} {...config} />
                        ))}
                      <Route component={PageNotFound} />
                    </Switch>
                  </LayoutWithLocation>
                </Switch>
              </Suspense>
            </DefaultHomeHandler>
          </PageVisitsAnalytics>
          <LegacyRoutesHandler />
        </DrawerProvider>
      </ScreenLockProvider>
    </>
  );
};
