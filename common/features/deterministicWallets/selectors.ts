import { AppState } from 'features/reducers';
import * as deterministicWalletsTypes from './types';

export function getWallets(state: AppState): deterministicWalletsTypes.DeterministicWalletData[] {
  return state.deterministicWallets.wallets;
}

export function getDesiredToken(state: AppState): string | undefined {
  return state.deterministicWallets.desiredToken;
}

export default {
  getWallets,
  getDesiredToken
};
