// @flow
import type PrivateKeyWallet from 'libs/wallet/privkey';
import type {
  GenerateWalletAction,
  ContinueToPaperAction,
  ResetGenerateWalletAction
} from 'actions/generateWallet';

export type State = {
  activeStep: string,
  wallet: ?PrivateKeyWallet,
  password: ?string
};

const initialState: State = {
  activeStep: 'password',
  wallet: null,
  password: null
};

type Action =
  | GenerateWalletAction
  | ContinueToPaperAction
  | ResetGenerateWalletAction;

export function generateWallet(
  state: State = initialState,
  action: Action
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
      return {
        ...state,
        ...initialState
      };
    }

    default:
      (action: empty);
      return state;
  }
}
