import { act, renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { default as useAnalytics } from './useAnalytics';

const renderUseAnalytics = () => {
  return renderHook(useAnalytics, { wrapper: ProvidersWrapper });
};

describe('useAnalytics', () => {
  it('track(): dispatchs action', () => {
    const mockDispatch = mockUseDispatch();
    const params = { name: 'Add Account' };
    const { result } = renderUseAnalytics();
    act(() => result.current.track(params));
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(params));
  });
  it('trackPage(): dispatchs action', () => {
    const mockDispatch = mockUseDispatch();
    const params = { name: 'Knowledge base', title: 'dummy title' };
    const { result } = renderUseAnalytics();
    act(() => result.current.trackPage(params));
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(params));
  });
});
