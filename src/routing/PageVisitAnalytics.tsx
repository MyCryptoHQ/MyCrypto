import React from 'react';

import { withRouter } from 'react-router-dom';

import { useAnalytics } from '@utils';

let previousURL: string | undefined;
export const PageVisitsAnalytics = withRouter(({ history, children }) => {
  const trackPageVisit = useAnalytics({
    trackPageViews: true
  });

  history.listen(() => {
    if (previousURL !== window.location.href) {
      trackPageVisit({
        actionName: window.location.href
      });
      previousURL = window.location.href;
    }
  });
  return <React.Fragment>{children}</React.Fragment>;
});
