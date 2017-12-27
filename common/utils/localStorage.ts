export const REDUX_STATE = 'REDUX_STATE';
import { State as SwapState } from 'reducers/swap';
import { IWallet, WalletConfig } from 'libs/wallet';
import { sha256 } from 'ethereumjs-util';

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

export function loadStatePropertyOrEmptyObject<T>(key: string): T | undefined {
  const localStorageState = loadState();
  if (localStorageState) {
    if (localStorageState.hasOwnProperty(key)) {
      return localStorageState[key] as T;
    }
  }
  return undefined;
}

export async function saveWalletConfig(
  wallet: IWallet,
  state: Partial<WalletConfig>
): Promise<WalletConfig> {
  const oldState = await loadWalletConfig(wallet);
  const newState = { ...oldState, ...state };
  const key = await getWalletConfigKey(wallet);
  localStorage.setItem(key, JSON.stringify(newState));
  return newState;
}

export async function loadWalletConfig(wallet: IWallet): Promise<WalletConfig> {
  try {
    const key = await getWalletConfigKey(wallet);
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : {};
  } catch (err) {
    console.error('Failed to load wallet state', err);
    return {};
  }
}

async function getWalletConfigKey(wallet: IWallet): Promise<string> {
  const address = await wallet.getAddressString();
  return sha256(`${address}-mew`).toString('hex');
}
