import { AnalyticsService } from '@services';

const useAnalytics = () => {
  /**
   * 1. Determine if tracking is allowed by accessing Settings
   * 2. Replace all calls with noOp if not.
   * 3. Allow user to toggle activation.
   */

  const { track, trackPage, initAnalytics } = AnalyticsService;
  return {
    track,
    trackPage,
    initAnalytics
  };
};

export default useAnalytics;
