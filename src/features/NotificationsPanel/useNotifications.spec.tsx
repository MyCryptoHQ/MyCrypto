import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { keys } from 'ramda';

import { fNotifications } from '@fixtures';
import { ExtendedNotification } from '@types';
import { DataContext, IDataContext } from '@services/Store';
import { NotificationTemplates } from './constants';
import useNotifications from './useNotifications';

const renderUseNotifications = ({
  notifications = [] as ExtendedNotification[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ notifications, createActions } as any) as IDataContext}>
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useNotifications(), { wrapper });
};

describe('useNotifications()', () => {
  it('initially returns an empty array of notifications', () => {
    const { result } = renderUseNotifications();
    expect(result.current.notifications).toEqual([]);
  });

  it('returns the notifications from the DataManager', () => {
    const { result } = renderUseNotifications({ notifications: fNotifications });
    expect(result.current.notifications.length).toEqual(fNotifications.length);
  });

  it('provides a dictionary of templates', () => {
    const { result } = renderUseNotifications();
    expect(keys(result.current.templates)).toEqual(keys(NotificationTemplates));
  });
});
