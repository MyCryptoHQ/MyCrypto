import { DataStore } from '@types';

import databaseSlice from './database.slice';
import { AppState } from './root.reducer';

export const getAppState = (s: AppState): DataStore => s[databaseSlice.name as 'database'];
