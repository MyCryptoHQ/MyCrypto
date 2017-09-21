import { DeterministicWalletData } from 'actions/deterministicWallets';
import { AppState } from 'reducers';

export function getWallets(state: AppState): DeterministicWalletData[] {
  return state.deterministicWallets.wallets;
}

export function getDesiredToken(state: AppState): string {
  return state.deterministicWallets.desiredToken;
}
