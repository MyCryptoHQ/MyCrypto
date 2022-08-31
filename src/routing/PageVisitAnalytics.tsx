import { Fragment } from 'react';

import { withRouter } from 'react-router-dom';

import { getRouteConfigByPath } from '@config';
import { useAnalytics } from '@services/Analytics';
import { useEffectOnce } from '@vendor';

// Assumes route param is always the last part of the route
const stripRouteParam = (path: string) => path.split('/:')[0];

export const PageVisitsAnalytics = withRouter(({ history, location }) => {
  const { trackPage } = useAnalytics();

  useEffectOnce(() => {
    history.listen((to) => {
      if (to.pathname === location.pathname) return;
      const { name, title } = getRouteConfigByPath(stripRouteParam(to.pathname)) || {};
      trackPage({ name, title });
    });
  });

  return <Fragment />;
});
