import { DataStore } from '@types';

import { AppState } from './root.reducer';

export const getAppState = (state: AppState): DataStore => state.legacy;
