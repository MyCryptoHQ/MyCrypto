import { PrivKeyWallet } from 'libs/wallet';
import * as interfaces from './actionTypes';
import * as constants from './constants';

export function generateNewWallet(
  password: string
): interfaces.GenerateNewWalletAction {
  return {
    type: constants.GENERATE_WALLET_GENERATE_WALLET,
    wallet: PrivKeyWallet.generate(),
    password
  };
}

export function continueToPaper(): interfaces.ContinueToPaperAction {
  return { type: constants.GENERATE_WALLET_CONTINUE_TO_PAPER };
}

export function resetGenerateWallet(): interfaces.ResetGenerateWalletAction {
  return { type: constants.GENERATE_WALLET_RESET };
}
