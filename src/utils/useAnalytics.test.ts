import { act, renderHook } from '@testing-library/react-hooks';

import { AnalyticsService, FeatureFlagProvider, useFeatureFlags } from '@services';
import { useEffectOnce } from '@vendor';

import { default as useAnalytics } from './useAnalytics';

const renderComponent = (isActive: boolean = true) => {
  return renderHook(
    () => {
      const { setFeatureFlag } = useFeatureFlags();
      useEffectOnce(() => {
        if (!isActive) {
          setFeatureFlag('ANALYTICS', false);
        }
      });

      return useAnalytics();
    },
    { wrapper: FeatureFlagProvider }
  );
};

describe('useAnalytics', () => {
  it('calls AnalyticsService when feature is active', () => {
    const spy = jest.spyOn(AnalyticsService, 'track').mockImplementationOnce(jest.fn());
    const { result } = renderComponent();
    act(() => result.current.track({ name: 'Header' }));
    expect(spy).toHaveBeenCalled();
  });
  it('blocks calls to AnalyticsService when feature is inactive', async () => {
    const spy = jest.spyOn(AnalyticsService, 'trackPage').mockImplementationOnce(jest.fn());
    const { result } = renderComponent(false);
    await act(async () => result.current.trackPage({ name: 'ADD_ACCOUNT_SOM', title: '' }));
    expect(spy).not.toHaveBeenCalled();
  });
});
