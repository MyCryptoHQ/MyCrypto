import { notifications } from 'reducers/notifications';
import * as notificationsActions from 'actions/notifications';

describe('customTokens reducer', () => {
  const notification1 = notificationsActions.showNotification('success', 'msg');

  const notification2 = notificationsActions.showNotification('danger', 'msg');

  it('should handle SHOW_NOTIFICATION', () => {
    const state = notifications(undefined, notification1);
    expect(notifications(state, notification2)).toEqual([
      notification1.payload,
      notification2.payload
    ]);
  });

  it('should handle CLOSE_NOTIFICATION', () => {
    const state1 = notifications(undefined, notification1);
    const state2 = notifications(state1, notification2);

    expect(
      notifications(state2, notificationsActions.closeNotification(notification2.payload))
    ).toEqual([notification1.payload]);
  });
});
