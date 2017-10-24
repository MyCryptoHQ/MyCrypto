export const REDUX_STATE = 'REDUX_STATE';
import { State as SwapState } from 'reducers/swap';

export function loadState<T>(): T | undefined {
  try {
    const serializedState = localStorage.getItem(REDUX_STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState || '');
  } catch (err) {
    console.warn(' Warning: corrupted local storage');
  }
}

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(REDUX_STATE, serializedState);
  } catch (err) {
    console.warn(' Warning: failed to set to local storage', state);
  }
};

export type SwapLocalStorage = SwapState;

export function loadStatePropertyOrEmptyObject<T>(key: string): T | undefined {
  const localStorageState = loadState();
  if (localStorageState) {
    if (localStorageState.hasOwnProperty(key)) {
      return localStorageState[key] as T;
    }
  }
  return undefined;
}
