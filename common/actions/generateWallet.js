import { genNewPkey, pkeyToAddress, genNewKeystore } from 'libs/keystore';

import {
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_SHOW_PASSWORD,
  GENERATE_WALLET_CONTINUE_TO_UNLOCK
} from 'actions/generateWalletConstants';

export const showPasswordGenerateWallet = () => {
  return { type: GENERATE_WALLET_SHOW_PASSWORD };
};

export const generateUTCGenerateWallet = password => {
  const privateKey = genNewPkey();
  const address = pkeyToAddress(privateKey);
  const walletFile = genNewKeystore(privateKey, password);

  return {
    type: GENERATE_WALLET_FILE,
    privateKey: privateKey.toString('hex'),
    address,
    walletFile
  };
};

export const downloadUTCGenerateWallet = () => {
  return { type: GENERATE_WALLET_DOWNLOAD_FILE };
};

export const confirmContinueToPaperGenerateWallet = () => {
  return { type: GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER };
};

export const continueToUnlockWallet = () => {
  return { type: GENERATE_WALLET_CONTINUE_TO_UNLOCK };
};
