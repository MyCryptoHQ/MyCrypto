// @flow
import type { State } from 'reducers';
import type { DerivedWallet } from 'actions/derivedWallets';

export function getWallets(state: State): DerivedWallet[] {
  return state.derivedWallets.wallets;
}

export function getDesiredToken(state: State): string {
  return state.derivedWallets.desiredToken;
}
