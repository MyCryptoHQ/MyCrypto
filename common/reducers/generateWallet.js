import {
  GENERATE_WALLET_SHOW_PASSWORD,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER
} from 'actions/generateWalletConstants';

const initialState = {
  showPassword: false,
  generateWalletFile: false,
  hasDownloadedWalletFile: false,
  canProceedToPaper: false
};

export function generateWallet(state = initialState, action) {
  switch (action.type) {
    case GENERATE_WALLET_SHOW_PASSWORD: {
      return {
        ...state,
        showPassword: !state.showPassword
      };
    }

    case GENERATE_WALLET_FILE: {
      return {
        ...state,
        generateWalletFile: true
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
        canProceedToPaper: true
      };
    }

    default:
      return state;
  }
}
