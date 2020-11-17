import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';

import { AppState } from './reducer';
import store from './store';

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

export { getAppState } from './reducer';
export { useSelector, useDispatch, store };
