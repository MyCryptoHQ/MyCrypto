import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';

import store from './store';

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
const useSelector: TypedUseSelectorHook<typeof store> = useReduxSelector;

export { useSelector, useDispatch, store };
