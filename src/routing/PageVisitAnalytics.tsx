import React, { useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import { useAnalytics } from '@hooks';

export const PageVisitsAnalytics = withRouter(({ history, location }) => {
  const { trackPage } = useAnalytics();

  useEffect(() => {
    history.listen((to) => {
      if (to.pathname !== location.pathname) {
        trackPage({
          name: '', //@todo get name and title from route config
          pathName: to.pathname
        });
      }
    });
  }, []);

  return <React.Fragment></React.Fragment>;
});
