import { ComponentProps } from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { translateRaw } from '@translations';
import { ExtendedNotification, NotificationTemplates } from '@types';

import NotificationsPanel from './NotificationsPanel';

const defaultProps: ComponentProps<typeof NotificationsPanel> = {
  accounts: fAccounts
};

function getComponent(
  props: ComponentProps<typeof NotificationsPanel>,
  notifications: ExtendedNotification[]
) {
  return simpleRender(<NotificationsPanel {...props} />, {
    initialState: mockAppState({
      accounts: fAccounts,
      notifications
    })
  });
}

describe('NotificationPanel', () => {
  it('renders Halloween notification', async () => {
    Date.now = jest
      .fn()
      .mockImplementation(() => new Date('Thu Nov 1 2021 09:00:00 PST').getTime());
    const { getByText } = getComponent(defaultProps, [
      { template: NotificationTemplates.halloweenPoap } as ExtendedNotification
    ]);
    expect(getByText(translateRaw('HALLOWEEN_POAP_NOTIFICATION_HEADER'))).toBeDefined();
  });
});
