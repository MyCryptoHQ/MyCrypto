import { DataStore } from '@types';

import databaseSlice from './database.slice';
import { AppState } from './root.reducer';

export const getAppState = (state: AppState): DataStore => state[databaseSlice.name as 'database'];
