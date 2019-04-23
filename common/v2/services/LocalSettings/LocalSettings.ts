import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createLocalSetting = create('localSettings');
export const readLocalSetting = read('localSettings');
export const updateLocalSetting = update('localSettings');
export const deleteLocalSetting = destroy('localSettings');
export const readLocalSettings = readAll('localSettings');
