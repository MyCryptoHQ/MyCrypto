import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createActiveNotifications = create('activeNotifications');
export const readActiveNotifications = read('activeNotifications');
export const updateActiveNotifications = update('activeNotifications');
export const deleteActiveNotifications = destroy('activeNotifications');
export const readAllActiveNotifications = readAll('activeNotifications');
