import { DeterministicWalletData } from './types';
import { AppState } from 'redux/reducers';

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
