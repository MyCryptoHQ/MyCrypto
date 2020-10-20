import { AnalyticsService, useFeatureFlags } from '@services';
import { mapObjIndexed } from '@vendor';

const useAnalytics = () => {
  /**
   * 1. Determine if tracking is allowed by accessing Settings
   * 2. Replace all calls with noOp if not.
   * 3. Allow user to toggle activation.
   */

  const { track, trackPage, initAnalytics } = AnalyticsService;
  const { isFeatureActive } = useFeatureFlags();

  const doNothing = (_?: any) => Promise.resolve();

  const API = {
    track,
    trackPage,
    initAnalytics
  };

  return isFeatureActive('ANALYTICS') ? { ...API } : mapObjIndexed(() => doNothing)(API);
};

export default useAnalytics;
