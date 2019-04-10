import { readSettings, updateSettings } from 'v2/services/LocalCache';

export const updateCurrents = updateSettings('currents');
export const readCurrents = readSettings('currents');
