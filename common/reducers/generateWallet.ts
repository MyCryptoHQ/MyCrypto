import { GenerateWalletAction } from 'actions/generateWallet';
import { TypeKeys } from 'actions/generateWallet/constants';
import PrivateKeyWallet from 'libs/wallet/privkey';

export interface State {
  activeStep: string;
  wallet?: PrivateKeyWallet | null;
  password?: string | null;
}

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
    case TypeKeys.GENERATE_WALLET_GENERATE_WALLET: {
      return {
        ...state,
        wallet: action.wallet,
        password: action.password,
        activeStep: 'download'
      };
    }

    case TypeKeys.GENERATE_WALLET_CONTINUE_TO_PAPER: {
      return {
        ...state,
        activeStep: 'paper'
      };
    }

    case TypeKeys.GENERATE_WALLET_RESET: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
