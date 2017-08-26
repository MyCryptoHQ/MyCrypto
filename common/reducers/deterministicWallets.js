import type {
  DeterministicWalletData,
  DeterministicWalletAction
} from 'actions/deterministicWallets';

export type State = {
  wallets: DeterministicWalletData[],
  desiredToken: string
};

export const INITIAL_STATE: State = {
  wallets: [],
  desiredToken: ''
};

export function deterministicWallets(
  state: State = INITIAL_STATE,
  action: DeterministicWalletAction
): State {
  switch (action.type) {
    case 'DW_SET_WALLETS':
      return {
        ...state,
        wallets: action.payload
      };

    case 'DW_SET_DESIRED_TOKEN':
      return {
        ...state,
        desiredToken: action.payload
      };

    case 'DW_UPDATE_WALLET':
      return {
        ...state,
        wallets: updateWalletValues(state.wallets, action.payload)
      };

    default:
      return state;
  }
}

function updateWalletValues(wallets, newWallet) {
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
