import type {
  DerivedWallet,
  DerivedWalletAction
} from 'actions/derivedWallets';

export type State = {
  cache: { [string]: DerivedWallet },
  wallets: DerivedWallet[],
  desiredToken: string
};

export const INITIAL_STATE: State = {
  cache: {},
  wallets: [],
  desiredToken: ''
};

export function derivedWallets(
  state: State = INITIAL_STATE,
  action: DerivedWalletAction
): State {
  switch (action.type) {
    case 'DERIVED_WALLETS_SET_WALLETS':
      return {
        ...state,
        wallets: action.payload
      };

    case 'DERIVED_WALLETS_SET_DESIRED_TOKEN':
      return {
        ...state,
        desiredToken: action.payload
      };

    case 'DERIVED_WALLETS_UPDATE_WALLET':
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
