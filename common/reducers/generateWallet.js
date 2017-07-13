// @flow
import {
  GENERATE_WALLET_SHOW_PASSWORD,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER
} from 'actions/generateWalletConstants';

export type State = {
  activeStep: string,
  generateWalletFile: boolean,
  hasDownloadedWalletFile: boolean,
  canProceedToPaper: boolean
};

const initialState: State = {
  activeStep: 'password',
  generateWalletFile: false,
  hasDownloadedWalletFile: false,
  canProceedToPaper: false
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

    default:
      return state;
  }
}
