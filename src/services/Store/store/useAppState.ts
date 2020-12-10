import { pipe } from 'ramda';
import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';

import { importSuccess } from './import.slice';
import { useDispatch } from './index';
import { AppState, exportState, getPassword, importState } from './reducer';
/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

export default function useAppState() {
  const dispatch = useDispatch();

  return {
    password: useSelector(getPassword),
    exportState: useSelector(exportState),
    importStorage: pipe(importState, dispatch),
    importSuccess: useSelector(importSuccess)
  };
}
