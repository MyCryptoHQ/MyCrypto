import { updateAll, readSection } from '../Cache';

export const updateScreenLockSettings = updateAll('screenLockSettings');
export const readScreenLockSettings = readSection('screenLockSettings');
