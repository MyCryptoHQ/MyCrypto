import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';

import { DataStore } from '@types';

import { AppState } from './root.reducer';

export const getAppState = (s: AppState): DataStore => s.database;

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
