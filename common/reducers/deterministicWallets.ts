import { DeterministicWalletAction, DeterministicWalletData } from 'actions/deterministicWallets';
import { TypeKeys } from 'actions/deterministicWallets/constants';

export interface State {
  wallets: DeterministicWalletData[];
  desiredToken: string | undefined;
}

export const INITIAL_STATE: State = {
  wallets: [],
  desiredToken: ''
};

export function deterministicWallets(
  state: State = INITIAL_STATE,
  action: DeterministicWalletAction
): State {
  switch (action.type) {
    case TypeKeys.DW_SET_WALLETS:
      return {
        ...state,
        wallets: action.payload
      };

    case TypeKeys.DW_SET_DESIRED_TOKEN:
      return {
        ...state,
        desiredToken: action.payload
      };

    case TypeKeys.DW_UPDATE_WALLET:
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
