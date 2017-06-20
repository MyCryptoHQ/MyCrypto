import {
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_SHOW_PASSWORD
} from 'actions/generateWalletConstants';

export const generateWalletShowPassword = () => {
  return { type: GENERATE_WALLET_SHOW_PASSWORD };
};

export const generateWalletGenerateFile = () => {
  return { type: GENERATE_WALLET_FILE };
};

export const generateWalletDownloadFile = () => {
  return { type: GENERATE_WALLET_DOWNLOAD_FILE };
};

export const generateWalletConfirmContinueToPaper = () => {
  return { type: GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER };
};
