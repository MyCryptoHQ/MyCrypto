import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { handleNotification } from 'sagas/notifications';
import { ShowNotificationAction, showNotification, closeNotification } from 'actions/notifications';

describe('handleNotification*', () => {
  const level = 'success';
  const msg = 'msg';
  const duration = 10;
  const notificationAction1: ShowNotificationAction = showNotification(level, msg, duration);
  const notificationAction2: ShowNotificationAction = showNotification(level, msg, 0);
  const gen1 = handleNotification(notificationAction1);
  const gen2 = handleNotification(notificationAction2);

  it('should call delay with duration', () => {
    expect(gen1.next(notificationAction1).value).toEqual(call(delay, duration));
  });

  it('should return when duration is zero', () => {
    expect(gen2.next(notificationAction2).done).toEqual(true);
  });

  it('should put closeNotification', () => {
    expect(gen1.next(notificationAction1).value).toEqual(
      put(closeNotification(notificationAction1.payload))
    );
  });

  it('should be done', () => {
    expect(gen1.next().done).toEqual(true);
  });
});
