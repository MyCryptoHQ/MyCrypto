import * as notificationsActions from './actions';
import * as notificationsReducer from './reducer';

describe('customTokens reducer', () => {
  const notification1 = notificationsActions.showNotification('success', 'msg');

  const notification2 = notificationsActions.showNotification('danger', 'msg');

  it('should handle SHOW_NOTIFICATION', () => {
    const state = notificationsReducer.notificationsReducer(undefined, notification1);
    expect(notificationsReducer.notificationsReducer(state, notification2)).toEqual([
      notification1.payload,
      notification2.payload
    ]);
  });

  it('should handle CLOSE_NOTIFICATION', () => {
    const state1 = notificationsReducer.notificationsReducer(undefined, notification1);
    const state2 = notificationsReducer.notificationsReducer(state1, notification2);

    expect(
      notificationsReducer.notificationsReducer(
        state2,
        notificationsActions.closeNotification(notification2.payload)
      )
    ).toEqual([notification1.payload]);
  });
});
