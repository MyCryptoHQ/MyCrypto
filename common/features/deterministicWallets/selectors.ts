import { AppState } from 'features/reducers';
import { DeterministicWalletData } from './types';

export function getWallets(state: AppState): DeterministicWalletData[] {
  return state.deterministicWallets.wallets;
}

export function getDesiredToken(state: AppState): string | undefined {
  return state.deterministicWallets.desiredToken;
}

export default {
  getWallets,
  getDesiredToken
};
