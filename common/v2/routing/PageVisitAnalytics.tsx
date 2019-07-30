import React from 'react';
import { withRouter } from 'react-router-dom';

import { AnalyticsService } from 'v2/services';

let previousURL: string | undefined;
export const PageVisitsAnalytics = withRouter(({ history, children }) => {
  history.listen(() => {
    if (previousURL !== window.location.href) {
      AnalyticsService.instance.trackPageVisit(window.location.href);
      previousURL = window.location.href;
    }
  });
  return <React.Fragment>{children}</React.Fragment>;
});
