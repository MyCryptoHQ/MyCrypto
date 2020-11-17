import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';

import { AppState, getPassword } from './reducer';
/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

export default function useAppState() {
  return {
    getUnlockPassword: useSelector(getPassword)
  };
}
