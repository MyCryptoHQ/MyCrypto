import { useDispatch } from '@store';
import { noOp } from '@utils';

import { useFeatureFlags } from '../FeatureFlag';
import { LinkParams, PageParams, TrackParams } from './Analytics';
import { trackEvent, trackLink, trackPage } from './saga';

const useAnalytics = () => {
  const dispatch = useDispatch();
  const { isFeatureActive } = useFeatureFlags();
  const isActive = isFeatureActive('ANALYTICS');

  // Replace all calls with noOp if feature is inactive
  return {
    track: isActive ? (payload: TrackParams) => dispatch(trackEvent(payload)) : noOp,
    trackPage: isActive ? (payload: PageParams) => dispatch(trackPage(payload)) : noOp,
    trackLink: isActive ? (payload: LinkParams) => dispatch(trackLink(payload)) : noOp
  };
};

export default useAnalytics;
