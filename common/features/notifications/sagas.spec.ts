import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import * as types from './types';
import * as actions from './actions';
import * as sagas from './sagas';

describe('handleNotification*', () => {
  const level = 'success';
  const msg = 'msg';
  const duration = 10;
  const notificationAction1: types.ShowNotificationAction = actions.showNotification(
    level,
    msg,
    duration
  );
  const notificationAction2: types.ShowNotificationAction = actions.showNotification(level, msg, 0);
  const gen1 = sagas.handleNotification(notificationAction1);
  const gen2 = sagas.handleNotification(notificationAction2);

  it('should call delay with duration', () => {
    expect(gen1.next(notificationAction1).value).toEqual(call(delay, duration));
  });

  it('should return when duration is zero', () => {
    expect(gen2.next(notificationAction2).done).toEqual(true);
  });

  it('should put closeNotification', () => {
    expect(gen1.next(notificationAction1).value).toEqual(
      put(actions.closeNotification(notificationAction1.payload))
    );
  });

  it('should be done', () => {
    expect(gen1.next().done).toEqual(true);
  });
});
