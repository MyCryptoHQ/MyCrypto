import { expectSaga, mockAppState } from 'test-utils';

import { fAccount, fNotifications } from '@fixtures';
import { NotificationTemplates, TUuid } from '@types';

import {
  createNotification,
  dismissNotification,
  dismissNotificationWorker,
  displayNotification,
  displayNotificationWorker,
  initialState,
  selectNotifications,
  default as slice,
  updateNotification
} from './notification.slice';

const reducer = slice.reducer;

jest.mock('uuid/v4', () => jest.fn().mockImplementation(() => 'foo'));

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2021, 6, 10));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('NotificationSlice', () => {
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

  describe('displayNotificationWorker', () => {
    it('creates notification if it doesnt exist', () => {
      const notification = {
        templateName: NotificationTemplates.walletAdded,
        templateData: { address: fAccount.address }
      };
      return expectSaga(displayNotificationWorker, displayNotification(notification))
        .withState(mockAppState({ notifications: [] }))
        .put(
          createNotification({
            uuid: 'foo' as TUuid,
            template: notification.templateName,
            templateData: notification.templateData,
            dateDisplayed: new Date(),
            dismissed: false,
            dateDismissed: undefined
          })
        )
        .silentRun();
    });

    it('updates notification if it does exist', () => {
      const notification = {
        templateName: NotificationTemplates.onboardingPleaseUnderstand,
        templateData: { address: fAccount.address }
      };
      const notificationState = {
        uuid: 'foo' as TUuid,
        template: notification.templateName,
        templateData: notification.templateData,
        dateDisplayed: new Date(),
        dismissed: true,
        dateDismissed: undefined
      };
      return expectSaga(displayNotificationWorker, displayNotification(notification))
        .withState(mockAppState({ notifications: [notificationState] }))
        .put(updateNotification(notificationState))
        .silentRun();
    });

    it('dismisses old notifications', () => {
      const notification = {
        templateName: NotificationTemplates.walletAdded,
        templateData: { address: fAccount.address }
      };
      const notificationState = {
        uuid: 'foo' as TUuid,
        template: notification.templateName,
        templateData: notification.templateData,
        dateDisplayed: new Date(),
        dismissed: false,
        dateDismissed: undefined
      };
      return expectSaga(displayNotificationWorker, displayNotification(notification))
        .withState(mockAppState({ notifications: [notificationState] }))
        .put(dismissNotification(notificationState))
        .silentRun();
    });
  });

  describe('dismissNotificationWorker', () => {
    it('puts updateNotification with dismissed values', () => {
      const notification = { ...fNotifications[0], dismissed: false };
      const notifications = [notification, fNotifications[1]];

      return expectSaga(dismissNotificationWorker, dismissNotification(notification))
        .withState(mockAppState({ notifications }))
        .put(updateNotification({ ...notification, dismissed: true, dateDismissed: new Date() }))
        .silentRun();
    });
  });
});
