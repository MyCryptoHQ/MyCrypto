import { DataStore } from '@types';

import { AppState } from './reducer';

export const getAppState = (state: AppState): DataStore => state.legacy;
