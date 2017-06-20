import {
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_SHOW_PASSWORD
} from 'actions/generateWalletConstants';

export const showPasswordGenerateWallet = () => {
  return { type: GENERATE_WALLET_SHOW_PASSWORD };
};

export const generateFileGenerateWallet = () => {
  return { type: GENERATE_WALLET_FILE };
};

export const downloadFileGenerateWallet = () => {
  return { type: GENERATE_WALLET_DOWNLOAD_FILE };
};

export const confirmContinueToPaperGenerateWallet = () => {
  return { type: GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER };
};
