import { create, read, update, destroy, readAll } from 'services/Store';

export const createNotification = create('notifications');
export const readNotification = read('notifications');
export const updateNotification = update('notifications');
export const deleteNotification = destroy('notifications');
export const readAllNotifications = readAll('notifications');
