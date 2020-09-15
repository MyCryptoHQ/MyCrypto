import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { fAccount, fNotifications } from '@fixtures';
import { LSKeys, ExtendedNotification } from '@types';
import { DataContext, IDataContext } from '@services';

import { useNotifications } from './useNotifications';
import { NotificationTemplates } from '.';

const renderUseNotifications = ({
  notifications = [] as ExtendedNotification[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ notifications, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useNotifications(), { wrapper });
};

describe('useNotifications', () => {
  it('uses get notifications from DataContext', () => {
    const { result } = renderUseNotifications({ notifications: fNotifications });
    expect(result.current.notifications).toEqual(fNotifications);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseNotifications({ createActions });
    expect(createActions).toHaveBeenCalledWith(LSKeys.NOTIFICATIONS);
  });

  it('current notification', () => {
    const notification = { ...fNotifications[0], dismissed: false, dateDismissed: undefined };
    const { result } = renderUseNotifications({
      notifications: [notification],
      createActions: jest.fn().mockImplementation(() => ({
        update: jest.fn()
      }))
    });
    expect(result.current.currentNotification).toBe(notification);
  });

  it('displayNotification calls model.createWithID', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseNotifications({
      notifications: [],
      createActions: jest.fn().mockImplementation(() => ({
        createWithID: mockCreate
      }))
    });
    act(() =>
      result.current.displayNotification(NotificationTemplates.walletCreated, {
        address: fAccount.address
      })
    );
    expect(mockCreate).toHaveBeenCalledWith(
      {
        template: NotificationTemplates.walletCreated,
        templateData: { address: fAccount.address },
        dismissed: false,
        dateDismissed: undefined,
        dateDisplayed: expect.any(Date),
        uuid: expect.any(String)
      },
      expect.any(String)
    );
  });

  it('dismissNotification calls model.update', () => {
    const notification = { ...fNotifications[0], dismissed: false, dateDismissed: undefined };
    const mockUpdate = jest.fn();
    const { result } = renderUseNotifications({
      notifications: [notification],
      createActions: jest.fn().mockImplementation(() => ({
        update: mockUpdate
      }))
    });
    act(() => result.current.dismissNotification(notification));
    expect(mockUpdate).toHaveBeenCalledWith(notification.uuid, {
      ...notification,
      dateDismissed: expect.any(Date),
      dismissed: true
    });
  });

  it('dismissCurrentNotification calls model.update', () => {
    const notification = { ...fNotifications[0], dismissed: false, dateDismissed: undefined };
    const mockUpdate = jest.fn();
    const { result } = renderUseNotifications({
      notifications: [notification],
      createActions: jest.fn().mockImplementation(() => ({
        update: mockUpdate
      }))
    });
    act(() => result.current.dismissCurrentNotification());
    expect(mockUpdate).toHaveBeenCalledWith(notification.uuid, {
      ...notification,
      dateDismissed: expect.any(Date),
      dismissed: true
    });
  });

  it('trackNotificationViewed calls model.update', () => {
    const notification = { ...fNotifications[1], dismissed: false, dateDismissed: undefined };
    const mockUpdate = jest.fn();
    const { result } = renderUseNotifications({
      notifications: [notification],
      createActions: jest.fn().mockImplementation(() => ({
        update: mockUpdate
      }))
    });
    act(() => result.current.trackNotificationViewed());
    expect(mockUpdate).toHaveBeenCalledWith(notification.uuid, {
      ...notification,
      viewed: true
    });
  });

  it('trackNotificationViewed dismisses viewed notification that should only be viewed once', () => {
    const notification = {
      ...fNotifications[1],
      dismissed: false,
      dateDismissed: undefined,
      viewed: true
    };
    const mockUpdate = jest.fn();
    const { result } = renderUseNotifications({
      notifications: [notification],
      createActions: jest.fn().mockImplementation(() => ({
        update: mockUpdate
      }))
    });
    // Will automatically dismiss notifications that should only be viewed once
    act(() => result.current.trackNotificationViewed());
    expect(mockUpdate).toHaveBeenCalledWith(notification.uuid, {
      ...notification,
      dateDismissed: expect.any(Date),
      dismissed: true,
      viewed: true
    });
  });
});
