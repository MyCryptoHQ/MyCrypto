import { act, renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { default as useAnalytics } from './useAnalytics';

const renderUseAnalytics = () => {
  return renderHook(useAnalytics, { wrapper: ProvidersWrapper });
};

describe('useAnalytics', () => {
  it('track(): dispatchs action', () => {
    const mockDispatch = mockUseDispatch();
    const params = { action: 'Add Account' };
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
  it('trackLink(): dispatchs action', () => {
    const mockDispatch = mockUseDispatch();
    const params = { url: 'mycrypto.com', type: 'link' };
    const { result } = renderUseAnalytics();
    act(() => result.current.trackLink(params));
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(params));
  });
});
