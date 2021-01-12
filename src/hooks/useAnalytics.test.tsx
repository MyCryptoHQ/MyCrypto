import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { FeatureFlagProvider, useFeatureFlags } from '@services';
import { useEffectOnce } from '@vendor';

import { default as useAnalytics } from './useAnalytics';

const renderUseAnalytics = (isActive: boolean = true) => {
  const wrapper: React.FC = ({ children }) => (
    <FeatureFlagProvider>
      <ProvidersWrapper>{children}</ProvidersWrapper>
    </FeatureFlagProvider>
  );

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
    { wrapper }
  );
};

describe('useAnalytics', () => {
  it('track(): dispatchs action when feature is active', () => {
    const mockDispatch = mockUseDispatch();
    const params = { name: 'Add Account' };
    const { result } = renderUseAnalytics();
    act(() => result.current.track(params));
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(params));
  });
  it('trackPage(): dispatchs action when feature is active', () => {
    const mockDispatch = mockUseDispatch();
    const params = { name: 'Knowledge base', title: 'dummy title' };
    const { result } = renderUseAnalytics();
    act(() => result.current.trackPage(params));
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(params));
  });
  it('blocks calls to AnalyticsService when feature is inactive', async () => {
    // const spy = jest.spyOn(AnalyticsService, 'trackPage').mockImplementationOnce(jest.fn());
    const mockDispatch = mockUseDispatch();
    const params = { name: 'Add Account' };
    const { result } = renderUseAnalytics(false);
    await act(async () => result.current.track(params));
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
