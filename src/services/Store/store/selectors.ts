import { DataStore } from '@types';

import persistanceSlice from './persistance.slice';
import { AppState } from './root.reducer';

export const getAppState = (s: AppState): DataStore => s[persistanceSlice.name as 'database'];
