import { Suspense } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';

import { AppLoading } from '@components';
import { ROUTE_PATHS } from '@config';
import { Dashboard, PageNotFound } from '@features';
import { Layout, LayoutConfig } from '@features/Layout';
import {
  DefaultHomeHandler,
  getAppRoutes,
  LegacyRoutesHandler,
  PageVisitsAnalytics,
  PrivateRoute
} from '@routing';
import { useFeatureFlags } from '@services';
import { SPACING } from '@theme';
import { ScrollToTop, useScreenSize } from '@utils';

const layoutConfig = (path: string, isMobile: boolean): LayoutConfig => {
  switch (path) {
    case ROUTE_PATHS.ROOT.path:
      return {
        centered: false,
        fluid: true,
        fullW: true
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
      <PageVisitsAnalytics />
      <DefaultHomeHandler>
        <Suspense
          fallback={
            <Layout>
              <AppLoading />
            </Layout>
          }
        >
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
      <LegacyRoutesHandler />
    </>
  );
};
