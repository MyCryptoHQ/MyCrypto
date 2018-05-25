import { showNotification, closeNotification } from './actions';
import { notificationsReducer } from './reducer';

describe('customTokens reducer', () => {
  const notification1 = showNotification('success', 'msg');

  const notification2 = showNotification('danger', 'msg');

  it('should handle SHOW_NOTIFICATION', () => {
    const state = notificationsReducer(undefined, notification1);
    expect(notificationsReducer(state, notification2)).toEqual([
      notification1.payload,
      notification2.payload
    ]);
  });

  it('should handle CLOSE_NOTIFICATION', () => {
    const state1 = notificationsReducer(undefined, notification1);
    const state2 = notificationsReducer(state1, notification2);

    expect(notificationsReducer(state2, closeNotification(notification2.payload))).toEqual([
      notification1.payload
    ]);
  });
});
