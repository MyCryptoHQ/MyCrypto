import { useDispatch } from '@store';
import { noOp } from '@utils';

import { useFeatureFlags } from '../FeatureFlag';
import { PageParams, TrackParams } from './Analytics';
import { trackEvent, trackPage } from './saga';

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
