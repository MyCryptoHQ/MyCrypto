import { readSettings, updateSettings } from '../Cache';

export const updateScreenLockSettings = updateSettings('screenLockSettings');
export const readScreenLockSettings = readSettings('screenLockSettings');
