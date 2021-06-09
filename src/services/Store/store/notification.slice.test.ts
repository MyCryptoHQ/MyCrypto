import { mockAppState } from 'test-utils';

import { fNotifications } from '@fixtures';

import {
  createNotification,
  initialState,
  selectNotifications,
  default as slice,
  updateNotification
} from './notification.slice';

const reducer = slice.reducer;

describe('Notification', () => {
  it('has an initialState', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('createNotification(): adds a notification to the store', () => {
    const notif = fNotifications[0];
    const actual = reducer(undefined, createNotification(notif));
    expect(actual).toEqual([notif]);
  });

  it('updateNotification(): can change status of notification', () => {
    const original = fNotifications[0];
    const updated = { ...original, dismissed: false };
    const actual = reducer([original], updateNotification(updated));
    expect(actual).toEqual([updated]);
  });

  it('selectNotifications(): selects the correct slice', () => {
    const actual = selectNotifications(mockAppState());
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
});
