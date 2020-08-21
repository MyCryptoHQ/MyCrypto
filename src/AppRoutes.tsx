import React, { Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { Layout, LayoutConfig } from '@features/Layout';
import { PageNotFound, Dashboard, ScreenLockProvider, DrawerProvider, MigrateLS } from '@features';
import { ScrollToTop, useScreenSize, withContext, IS_E2E } from '@utils';
import { useFeatureFlags } from '@services';
import { StoreContext, SettingsContext } from '@services/Store';
import { ROUTE_PATHS } from '@config';
import {
  PageVisitsAnalytics,
  LegacyRoutesHandler,
  DefaultHomeHandler,
  PrivateRoute,
  getAppRoutes
} from '@routing';
import { COLORS, SPACING } from '@theme';
import { pipe } from '@vendor';

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

const MigrateLSWithStore = pipe(withContext(StoreContext), withContext(SettingsContext))(MigrateLS);

export const AppRoutes = () => {
  const { IS_ACTIVE_FEATURE } = useFeatureFlags();

  return (
    <>
      <ScrollToTop />
      <ScreenLockProvider>
        <DrawerProvider>
          <PageVisitsAnalytics>
            <DefaultHomeHandler>
              <Suspense fallback={<AppLoading />}>
                {!IS_E2E && <MigrateLSWithStore />}
                <Switch>
                  {/* To avoid fiddling with layout we provide a complete route to home */}
                  <LayoutWithLocation>
                    <Switch>
                      <Route path={ROUTE_PATHS.ROOT.path} component={Dashboard} exact={true} />
                      {getAppRoutes(IS_ACTIVE_FEATURE)
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
