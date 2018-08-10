import { AppState } from 'features/reducers';
import * as types from './types';

export function getWallets(state: AppState): types.DeterministicWalletData[] {
  return state.deterministicWallets.wallets;
}

export function getDesiredToken(state: AppState): string | undefined {
  return state.deterministicWallets.desiredToken;
}

export default {
  getWallets,
  getDesiredToken
};
