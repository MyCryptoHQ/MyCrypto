import * as deterministicWalletsTypes from './types';

export const INITIAL_STATE: deterministicWalletsTypes.DeterministicWalletsState = {
  wallets: [],
  desiredToken: ''
};

export function deterministicWalletsReducer(
  state: deterministicWalletsTypes.DeterministicWalletsState = INITIAL_STATE,
  action: deterministicWalletsTypes.DeterministicWalletAction
): deterministicWalletsTypes.DeterministicWalletsState {
  switch (action.type) {
    case deterministicWalletsTypes.DeterministicWalletsActions.SET:
      return {
        ...state,
        wallets: action.payload
      };

    case deterministicWalletsTypes.DeterministicWalletsActions.SET_DESIRED_TOKEN:
      return {
        ...state,
        desiredToken: action.payload
      };

    case deterministicWalletsTypes.DeterministicWalletsActions.UPDATE_WALLET:
      return {
        ...state,
        wallets: updateWalletValues(state.wallets, action.payload)
      };

    default:
      return state;
  }
}

function updateWalletValues(
  wallets: deterministicWalletsTypes.DeterministicWalletData[],
  newWallet: Partial<deterministicWalletsTypes.DeterministicWalletData>
) {
  return wallets.map(w => {
    if (w.address === newWallet.address) {
      return {
        ...w,
        ...newWallet
      };
    }

    return w;
  });
}
