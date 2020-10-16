import React from 'react';

import { withRouter } from 'react-router-dom';
import { useEffectOnce } from 'vendor';

import { getRouteConfigByPath } from '@config';
import { useAnalytics } from '@hooks';

export const PageVisitsAnalytics = withRouter(({ history, location }) => {
  const { trackPage } = useAnalytics();

  useEffectOnce(() => {
    history.listen((to) => {
      if (to.pathname === location.pathname) return;
      const { name, title } = getRouteConfigByPath(to.pathname) || {};
      // Include additional information. @blockstack/stats/client already handles the path for us.
      trackPage({ name, title });
    });
  });

  return <React.Fragment></React.Fragment>;
});
