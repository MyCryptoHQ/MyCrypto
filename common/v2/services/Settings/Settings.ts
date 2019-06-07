import { readSettings, updateSettings } from 'v2/services/LocalCache';

export const updateSetting = updateSettings('settings');
export const readAllSettings = readSettings('settings');
