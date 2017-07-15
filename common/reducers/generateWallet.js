// @flow
import {
  GENERATE_WALLET_SHOW_PASSWORD,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  GENERATE_WALLET_CONTINUE_TO_UNLOCK
} from 'actions/generateWalletConstants';
import { WalletFile } from 'libs/keystore';

export type State = {
  activeStep: string,
  hasDownloadedWalletFile: boolean,
  privateKey: Buffer,
  address: string,
  walletFile: WalletFile
};

const initialState: State = {
  activeStep: 'password',
  hasDownloadedWalletFile: false,
  privateKey: null,
  address: null,
  walletFile: null
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
        privateKey: action.privateKey,
        address: action.address,
        walletFile: action.walletFile,
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

    case GENERATE_WALLET_CONTINUE_TO_UNLOCK: {
      return {
        ...state,
        activeStep: 'unlock'
      };
    }

    default:
      return state;
  }
}
