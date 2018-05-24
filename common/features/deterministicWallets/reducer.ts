import {
  DETERMINISTIC_WALLETS,
  DeterministicWalletAction,
  DeterministicWalletData,
  DeterministicWalletsState
} from './types';

export const INITIAL_STATE: DeterministicWalletsState = {
  wallets: [],
  desiredToken: ''
};

export function deterministicWalletsReducer(
  state: DeterministicWalletsState = INITIAL_STATE,
  action: DeterministicWalletAction
): DeterministicWalletsState {
  switch (action.type) {
    case DETERMINISTIC_WALLETS.SET:
      return {
        ...state,
        wallets: action.payload
      };

    case DETERMINISTIC_WALLETS.SET_DESIRED_TOKEN:
      return {
        ...state,
        desiredToken: action.payload
      };

    case DETERMINISTIC_WALLETS.UPDATE_WALLET:
      return {
        ...state,
        wallets: updateWalletValues(state.wallets, action.payload)
      };

    default:
      return state;
  }
}

function updateWalletValues(
  wallets: DeterministicWalletData[],
  newWallet: Partial<DeterministicWalletData>
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
