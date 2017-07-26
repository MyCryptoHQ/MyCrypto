// @flow
import type PrivateKeyWallet from 'libs/wallet/privkey';
import type { GenerateWalletAction } from 'actions/generateWallet';

export type State = {
  activeStep: string,
  wallet: ?PrivateKeyWallet,
  password: ?string
};

export const INITIAL_STATE: State = {
  activeStep: 'password',
  wallet: null,
  password: null
};

export function generateWallet(
  state: State = INITIAL_STATE,
  action: GenerateWalletAction
): State {
  switch (action.type) {
    case 'GENERATE_WALLET_GENERATE_WALLET': {
      return {
        ...state,
        wallet: action.wallet,
        password: action.password,
        activeStep: 'download'
      };
    }

    case 'GENERATE_WALLET_CONTINUE_TO_PAPER': {
      return {
        ...state,
        activeStep: 'paper'
      };
    }

    case 'GENERATE_WALLET_RESET': {
      return INITIAL_STATE;
    }

    default:
      (action: empty);
      return state;
  }
}
