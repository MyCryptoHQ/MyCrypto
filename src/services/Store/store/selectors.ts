import { DataStore } from '@types';

import { AppState } from './root.reducer';

export const getAppState = (s: AppState): DataStore => s.database;
