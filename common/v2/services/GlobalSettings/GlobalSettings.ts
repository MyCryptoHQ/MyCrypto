import { readSettings, updateSettings } from 'v2/services/LocalCache';

export const updateGlobalSettings = updateSettings('globalSettings');
export const readGlobalSettings = readSettings('globalSettings');
