// @flow
import { PrivKeyWallet } from 'libs/wallet';

/*** Generate Wallet File ***/
export type GenerateWalletAction = {
  type: 'GENERATE_WALLET_GENERATE_WALLET',
  wallet: PrivKeyWallet,
  password: string
};

export function generateWallet(password: string): GenerateWalletAction {
  return {
    type: 'GENERATE_WALLET_GENERATE_WALLET',
    wallet: PrivKeyWallet.generate(),
    password
  };
}

/*** Confirm Continue To Paper ***/
export type ContinueToPaperAction = {
  type: 'GENERATE_WALLET_CONTINUE_TO_PAPER'
};

export function continueToPaper(): ContinueToPaperAction {
  return { type: 'GENERATE_WALLET_CONTINUE_TO_PAPER' };
}

/*** Reset Generate Wallet ***/
export type ResetGenerateWalletAction = {
  type: 'GENERATE_WALLET_RESET'
};

export function resetGenerateWallet(): ResetGenerateWalletAction {
  return { type: 'GENERATE_WALLET_RESET' };
}
