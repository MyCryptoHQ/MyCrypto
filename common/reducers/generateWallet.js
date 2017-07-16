// @flow
import {
  GENERATE_WALLET_SHOW_PASSWORD,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  RESET_GENERATE_WALLET
} from 'actions/generateWalletConstants';
import type PrivateKeyWallet from 'libs/wallet/privkey';

export type State = {
  activeStep: string,
  hasDownloadedWalletFile: boolean,
  wallet: ?PrivateKeyWallet,
  password: ?string
};

const initialState: State = {
  activeStep: 'password',
  hasDownloadedWalletFile: false,
  wallet: null,
  password: null
};

export function generateWallet(state: State = initialState, action): State {
  switch (action.type) {
    case GENERATE_WALLET_SHOW_PASSWORD: {
      return {
        ...state,
        activeStep: 'password'
      };
    }

    case GENERATE_WALLET_FILE: {
      return {
        ...state,
        wallet: action.wallet,
        password: action.password,
        activeStep: 'download'
      };
    }

    case GENERATE_WALLET_DOWNLOAD_FILE: {
      return {
        ...state,
        hasDownloadedWalletFile: true
      };
    }

    case GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER: {
      return {
        ...state,
        activeStep: 'paper'
      };
    }

    case RESET_GENERATE_WALLET: {
      return {
        ...state,
        ...initialState
      };
    }

    default:
      return state;
  }
}
