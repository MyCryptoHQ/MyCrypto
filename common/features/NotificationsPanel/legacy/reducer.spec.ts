import * as actions from './actions';
import * as reducer from './reducer';

describe('customTokens reducer', () => {
  const notification1 = actions.showNotification('success', 'msg');

  const notification2 = actions.showNotification('danger', 'msg');

  it('should handle SHOW_NOTIFICATION', () => {
    const state = reducer.notificationsReducer(undefined, notification1);
    expect(reducer.notificationsReducer(state, notification2)).toEqual([
      notification1.payload,
      notification2.payload
    ]);
  });

  it('should handle CLOSE_NOTIFICATION', () => {
    const state1 = reducer.notificationsReducer(undefined, notification1);
    const state2 = reducer.notificationsReducer(state1, notification2);

    expect(
      reducer.notificationsReducer(state2, actions.closeNotification(notification2.payload))
    ).toEqual([notification1.payload]);
  });
});
