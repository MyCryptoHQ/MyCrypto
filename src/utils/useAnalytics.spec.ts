import mockAxios from 'jest-mock-axios';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import { ANALYTICS_CATEGORIES } from '@services';
import { useAnalytics } from '@utils/index';

const categoryFixture = ANALYTICS_CATEGORIES.ROOT;
const actionNameFixture = 'Testing action name';
const appUrlFixture = '/sample/route';

describe('useAnalytics', () => {
  it('Should track on mount', async () => {
    renderHook(() =>
      useAnalytics({
        category: categoryFixture,
        actionName: actionNameFixture,
        triggerOnMount: true
      })
    );

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
  });

  it('Should track on callback', async () => {
    const { result } = renderHook(() =>
      useAnalytics({
        category: categoryFixture,
        actionName: actionNameFixture
      })
    );

    result.current();
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
  });

  it('Should track page view on mount', async () => {
    renderHook(() =>
      useAnalytics({
        trackPageViews: true,
        actionName: appUrlFixture,
        triggerOnMount: true
      })
    );

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
  });

  it('Should track page view on callback', async () => {
    const { result } = renderHook(() =>
      useAnalytics({
        trackPageViews: true
      })
    );

    result.current({
      actionName: appUrlFixture
    });
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
  });
});
