import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { notificationsConfigs } from '@features/NotificationsPanel/constants';
import { ExtendedNotification, LSKeys } from '@types';
import { generateUUID } from '@utils';
import { findIndex, propEq } from '@vendor';

import { getAppState } from './selectors';

export const initialState = [] as ExtendedNotification[];

const slice = createSlice({
  name: LSKeys.NOTIFICATIONS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedNotification>) {
      state.push(action.payload);
    },

    update(state, action: PayloadAction<ExtendedNotification>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    }
  }
});

export const { create: createNotification, update: updateNotification } = slice.actions;

export const selectNotifications = createSelector(getAppState, (s) =>
  s.notifications.filter((n) => n.template in notificationsConfigs)
);

export default slice;

export const displayNotification = createAction<{ templateName: string; templateData?: TObject }>(
  `${slice.name}/displayNotification`
);

export const dismissNotification = createAction<ExtendedNotification>(
  `${slice.name}/dismissNotification`
);

/**
 * Sagas
 */
export function* notificationSaga() {
  yield all([
    takeLatest(displayNotification.type, displayNotificationWorker),
    takeLatest(dismissNotification.type, dismissNotificationWorker)
  ]);
}

export function* displayNotificationWorker({
  payload: { templateName, templateData }
}: PayloadAction<{ templateName: string; templateData?: TObject }>) {
  const notifications: ExtendedNotification[] = yield select(selectNotifications);
  // Dismiss previous notifications that need to be dismissed
  if (!notificationsConfigs[templateName]?.preventDismisExisting) {
    const dismissableNotifications = notifications.filter(
      (x) => notificationsConfigs[x.template].dismissOnOverwrite && !x.dismissed
    );
    for (const notif of dismissableNotifications) {
      yield put(dismissNotification(notif));
    }
  }

  // Create the notification object
  const notification: ExtendedNotification = {
    uuid: generateUUID(),
    template: templateName,
    templateData,
    dateDisplayed: new Date(),
    dismissed: false,
    dateDismissed: undefined
  };

  // If notification with this template already exists update it,
  // otherwise create a new one
  const existingNotification = notifications.find((x) => x.template === notification.template);

  if (existingNotification) {
    /* Prevent displaying notifications that have been dismissed forever and repeating notifications
     before their waiting period is over.*/
    if (
      notificationsConfigs[templateName]?.repeatInterval ||
      notificationsConfigs[templateName]?.dismissForever
    ) {
      notification.dismissed = existingNotification.dismissed;
      notification.dateDismissed = existingNotification.dateDismissed;
    }

    yield put(updateNotification(notification));
  } else {
    yield put(createNotification(notification));
  }
}

export function* dismissNotificationWorker({ payload }: PayloadAction<ExtendedNotification>) {
  yield put(
    updateNotification({
      ...payload,
      dismissed: true,
      dateDismissed: new Date()
    })
  );
}
