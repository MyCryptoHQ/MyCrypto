import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fAccount, fNotifications } from '@fixtures';
import { ExtendedNotification } from '@types';

import { NotificationTemplates } from '.';
import { useNotifications } from './useNotifications';

const renderUseNotifications = ({ notifications = [] as ExtendedNotification[] } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ notifications })}>{children}</ProvidersWrapper>
  );
  return renderHook(() => useNotifications(), { wrapper });
};

describe('useNotifications', () => {
  it('uses get notifications from the store', () => {
    const { result } = renderUseNotifications({ notifications: fNotifications });
    expect(result.current.notifications).toEqual(fNotifications);
  });

  it('defines current notification', () => {
    const notification = { ...fNotifications[0], dismissed: false, dateDismissed: undefined };
    const { result } = renderUseNotifications({ notifications: [notification] });
    expect(result.current.currentNotification).toBe(notification);
  });

  it('displayNotification() dispatches create action', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNotifications({ notifications: [] });
    act(() =>
      result.current.displayNotification(NotificationTemplates.walletCreated, {
        address: fAccount.address
      })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        template: NotificationTemplates.walletCreated,
        templateData: { address: fAccount.address },
        dismissed: false,
        dateDismissed: undefined,
        dateDisplayed: expect.any(Date),
        uuid: expect.any(String)
      })
    );
  });

  it('dismissNotification() dispatches update action', () => {
    const notification = { ...fNotifications[0], dismissed: false, dateDismissed: undefined };
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNotifications({ notifications: [notification] });
    act(() => result.current.dismissNotification(notification));
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...notification,
        dateDismissed: expect.any(Date),
        dismissed: true
      })
    );
  });

  it('dismissCurrentNotification() dispatches update action', () => {
    const notification = { ...fNotifications[0], dismissed: false, dateDismissed: undefined };
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNotifications({ notifications: [notification] });
    act(() => result.current.dismissCurrentNotification());
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...notification,
        dateDismissed: expect.any(Date),
        dismissed: true
      })
    );
  });

  it('trackNotificationViewed() dispatch update action', () => {
    const notification = { ...fNotifications[1], dismissed: false, dateDismissed: undefined };
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNotifications({ notifications: [notification] });
    act(() => result.current.trackNotificationViewed());
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...notification,
        viewed: true
      })
    );
  });

  it('trackNotificationViewed dismisses viewed notification that should only be viewed once', () => {
    const notification = {
      ...fNotifications[1],
      dismissed: false,
      dateDismissed: undefined,
      viewed: true
    };
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseNotifications({ notifications: [notification] });
    // Will automatically dismiss notifications that should only be viewed once
    act(() => result.current.trackNotificationViewed());
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...notification,
        dateDismissed: expect.any(Date),
        dismissed: true,
        viewed: true
      })
    );
  });
});
