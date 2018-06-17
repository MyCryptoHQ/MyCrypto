import * as types from './types';

export const INITIAL_STATE: types.DeterministicWalletsState = {
  wallets: [],
  desiredToken: ''
};

export function deterministicWalletsReducer(
  state: types.DeterministicWalletsState = INITIAL_STATE,
  action: types.DeterministicWalletAction
): types.DeterministicWalletsState {
  switch (action.type) {
    case types.DeterministicWalletsActions.SET:
      return {
        ...state,
        wallets: action.payload
      };

    case types.DeterministicWalletsActions.SET_DESIRED_TOKEN:
      return {
        ...state,
        desiredToken: action.payload
      };

    case types.DeterministicWalletsActions.UPDATE_WALLET:
      return {
        ...state,
        wallets: updateWalletValues(state.wallets, action.payload)
      };

    default:
      return state;
  }
}

function updateWalletValues(
  wallets: types.DeterministicWalletData[],
  newWallet: Partial<types.DeterministicWalletData>
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
