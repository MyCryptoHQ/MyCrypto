import { AppState } from 'features/reducers';

export const REDUX_STATE = 'REDUX_STATE';

export function loadState<T>(): T | undefined {
  try {
    const serializedState = localStorage.getItem(REDUX_STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState || '{}');
  } catch (err) {
    console.warn(' Warning: corrupted local storage', err);
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

export function loadStatePropertyOrEmptyObject<T>(key: keyof AppState): T | undefined {
  const localStorageState: Partial<AppState> | undefined = loadState();
  if (localStorageState) {
    if (localStorageState.hasOwnProperty(key)) {
      return localStorageState[key] as T;
    }
  }
  return undefined;
}

export function isBetaUser() {
  return !!localStorage.getItem('acknowledged-beta');
}
