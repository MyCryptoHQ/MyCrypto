import { AnalyticsService } from '@services';

const useAnalytics = () => {
  const { track, trackPage, initAnalytics } = AnalyticsService;
  return {
    track,
    trackPage,
    initAnalytics
  };
};

export default useAnalytics;
