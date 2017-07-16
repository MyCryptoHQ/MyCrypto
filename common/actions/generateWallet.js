// @flow
import {
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_SHOW_PASSWORD,
  RESET_GENERATE_WALLET
} from 'actions/generateWalletConstants';
import { PrivKeyWallet } from 'libs/wallet';

export const showPasswordGenerateWallet = () => {
  return { type: GENERATE_WALLET_SHOW_PASSWORD };
};

export const generateUTCGenerateWallet = (password: string) => {
  return {
    type: GENERATE_WALLET_FILE,
    wallet: PrivKeyWallet.generate(),
    password
  };
};

export const downloadUTCGenerateWallet = () => {
  return { type: GENERATE_WALLET_DOWNLOAD_FILE };
};

export const confirmContinueToPaperGenerateWallet = () => {
  return { type: GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER };
};

export const resetGenerateWallet = () => {
  return { type: RESET_GENERATE_WALLET };
};
