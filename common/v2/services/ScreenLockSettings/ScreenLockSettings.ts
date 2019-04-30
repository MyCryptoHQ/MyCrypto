import { readSettings, updateSettings } from 'v2/services/LocalCache';

export const updateScreenLockSettings = updateSettings('screenLockSettings');
export const readScreenLockSettings = readSettings('screenLockSettings');
