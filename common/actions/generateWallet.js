// @flow
import {
  GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER,
  GENERATE_WALLET_FILE,
  GENERATE_WALLET_DOWNLOAD_FILE,
  GENERATE_WALLET_SHOW_PASSWORD,
  RESET_GENERATE_WALLET
} from 'actions/generateWalletConstants';
import { PrivKeyWallet } from 'libs/wallet';

type ShowPasswordAction = {
  type: 'GENERATE_WALLET_SHOW_PASSWORD'
};

export type GenerateUTCAction = {
  type: 'GENERATE_WALLET_FILE',
  wallet: PrivKeyWallet,
  password: string
};

type DownloadFileAction = {
  type: 'GENERATE_WALLET_DOWNLOAD_FILE'
};

type ConfirmContinueToPaperWalletAction = {
  type: 'GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER'
};

type ResetGenerateWalletAction = {
  type: 'RESET_GENERATE_WALLET'
};

export type GenerateWalletAction =
  | ShowPasswordAction
  | GenerateUTCAction
  | DownloadFileAction
  | ConfirmContinueToPaperWalletAction
  | ResetGenerateWalletAction;

export const showPasswordGenerateWallet = (): ShowPasswordAction => {
  return { type: GENERATE_WALLET_SHOW_PASSWORD };
};

export const generateUTCGenerateWallet = (
  password: string
): GenerateUTCAction => {
  return {
    type: GENERATE_WALLET_FILE,
    wallet: PrivKeyWallet.generate(),
    password
  };
};

export const downloadUTCGenerateWallet = (): DownloadFileAction => {
  return { type: GENERATE_WALLET_DOWNLOAD_FILE };
};

export const confirmContinueToPaperGenerateWallet = (): ConfirmContinueToPaperWalletAction => {
  return { type: GENERATE_WALLET_CONFIRM_CONTINUE_TO_PAPER };
};

export const resetGenerateWallet = (): ResetGenerateWalletAction => {
  return { type: RESET_GENERATE_WALLET };
};
