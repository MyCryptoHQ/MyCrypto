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
  it('renders Winter notification', async () => {
    Date.now = jest
      .fn()
      .mockImplementation(() => new Date('Thu Dec 2 2021 09:00:00 PST').getTime());
    const { getByText } = getComponent(defaultProps, [
      { template: NotificationTemplates.winterPoap } as ExtendedNotification
    ]);
    expect(getByText(translateRaw('POAP_NOTIFICATION_HEADER'))).toBeDefined();
  });
});
