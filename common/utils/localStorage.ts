import { sha256 } from 'ethereumjs-util';
import { State as SwapState } from 'reducers/swap';
import { IWallet, WalletConfig } from 'libs/wallet';
import { AppState } from 'reducers';

export const REDUX_STATE = 'REDUX_STATE';
export const ONBOARD_LOCAL_STORAGE_KEY = 'onboardStatus';
export const NUMBER_OF_ONBOARD_SLIDES = 10;

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

export type SwapLocalStorage = SwapState;

export function loadStatePropertyOrEmptyObject<T>(key: keyof AppState): T | undefined {
  const localStorageState: Partial<AppState> | undefined = loadState();
  if (localStorageState) {
    if (localStorageState.hasOwnProperty(key)) {
      return localStorageState[key] as T;
    }
  }
  return undefined;
}

export function saveWalletConfig(wallet: IWallet, state: Partial<WalletConfig>): WalletConfig {
  const oldState = loadWalletConfig(wallet);
  const newState = { ...oldState, ...state };
  const key = getWalletConfigKey(wallet);
  localStorage.setItem(key, JSON.stringify(newState));
  return newState;
}

export function loadWalletConfig(wallet: IWallet): WalletConfig {
  try {
    const key = getWalletConfigKey(wallet);
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : {};
  } catch (err) {
    console.error('Failed to load wallet state', err);
    return {};
  }
}

function getWalletConfigKey(wallet: IWallet): string {
  const address = wallet.getAddressString();
  return sha256(`${address}-mycrypto`).toString('hex');
}

export function isLegacyUser() {
  // All devs are legacy users!
  const oldLSValue = localStorage.getItem('gasPrice') || process.env.NODE_ENV !== 'production';
  const onboardProgress = localStorage.getItem(ONBOARD_LOCAL_STORAGE_KEY);

  if (oldLSValue && onboardProgress && parseInt(onboardProgress, 10) >= NUMBER_OF_ONBOARD_SLIDES) {
    return true;
  }
  return false;
}

export function isBetaUser() {
  return !!localStorage.getItem('acknowledged-beta');
}
