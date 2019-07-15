import { readSettings, updateSettings } from '../LocalCache';

export const updateScreenLockSettings = updateSettings('screenLockSettings');
export const readScreenLockSettings = readSettings('screenLockSettings');
