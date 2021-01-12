import { useFeatureFlags } from '@services';
import { PageParams, trackEvent, trackPage, TrackParams } from '@services/Analytics';
import { useDispatch } from '@store';
import { noOp } from '@utils';

const useAnalytics = () => {
  const dispatch = useDispatch();
  const { isFeatureActive } = useFeatureFlags();
  const isActive = isFeatureActive('ANALYTICS');

  // Replace all calls with noOp if feature is inactive
  return {
    track: isActive ? (payload: TrackParams) => dispatch(trackEvent(payload)) : noOp,
    trackPage: isActive ? (payload: PageParams) => dispatch(trackPage(payload)) : noOp
  };
};

export default useAnalytics;
