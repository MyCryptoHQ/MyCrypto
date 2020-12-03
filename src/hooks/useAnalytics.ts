import { useCallback, useEffect } from 'react';

import { ANALYTICS_CATEGORIES, AnalyticsService } from '@services';

interface AnalyticCallbackProps {
  category?: ANALYTICS_CATEGORIES;
  actionName?: string;
  eventParams?: { [name: string]: string | number };
}

interface Props extends AnalyticCallbackProps {
  triggerOnMount?: boolean;
  trackPageViews?: boolean;

  shouldTrack?(): boolean;
}

const useAnalytics = ({
  category,
  actionName,
  eventParams,
  triggerOnMount = false,
  trackPageViews = false,
  shouldTrack = () => true
}: Props): ((
  callbackProps?: AnalyticCallbackProps
) =>
  | ReturnType<typeof AnalyticsService.instance.track>
  | ReturnType<typeof AnalyticsService.instance.trackPageVisit>) => {
  const triggerAnalytics = useCallback(
    async (
      {
        category: callbackCategory,
        actionName: callbackActionName,
        eventParams: callbackEventParams
      }: AnalyticCallbackProps = {
        category: undefined,
        actionName: undefined,
        eventParams: undefined
      }
    ) => {
      const trackCategory = (callbackCategory || category)!;
      const trackActionName = (callbackActionName || actionName)!;
      const shouldBeTracking = shouldTrack();
      if (!trackPageViews && shouldBeTracking && !!trackCategory && !!trackActionName) {
        return await AnalyticsService.instance.track(
          trackCategory,
          trackActionName,
          callbackEventParams || eventParams
        );
      } else if (trackPageViews && shouldBeTracking && !!trackActionName) {
        return await AnalyticsService.instance.trackPageVisit(trackActionName);
      }
      // Reject, in case not all requirements for call are met
      return Promise.reject();
    },
    [category, actionName, eventParams, shouldTrack]
  );

  useEffect(() => {
    if (triggerOnMount) {
      triggerAnalytics();
    }
  }, [triggerOnMount]);

  return triggerAnalytics;
};

export default useAnalytics;
