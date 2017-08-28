// @flow
import type { State } from 'reducers';
import type { DeterministicWalletData } from 'actions/deterministicWallets';

export function getWallets(state: State): DeterministicWalletData[] {
  return state.deterministicWallets.wallets;
}

export function getDesiredToken(state: State): string {
  return state.deterministicWallets.desiredToken;
}
