import { DeterministicWalletData } from 'actions/deterministicWallets';
import { State } from 'reducers';

export function getWallets(state: State): DeterministicWalletData[] {
  return state.deterministicWallets.wallets;
}

export function getDesiredToken(state: State): string {
  return state.deterministicWallets.desiredToken;
}
