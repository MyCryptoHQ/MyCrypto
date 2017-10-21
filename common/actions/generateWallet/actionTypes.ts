import { IFullWallet } from 'ethereumjs-wallet';
import { TypeKeys } from './constants';

/*** Generate Wallet File ***/
export interface GenerateNewWalletAction {
  type: TypeKeys.GENERATE_WALLET_GENERATE_WALLET;
  wallet: IFullWallet;
  password: string;
}

/*** Reset Generate Wallet ***/
export interface ResetGenerateWalletAction {
  type: TypeKeys.GENERATE_WALLET_RESET;
}

/*** Confirm Continue To Paper ***/
export interface ContinueToPaperAction {
  type: TypeKeys.GENERATE_WALLET_CONTINUE_TO_PAPER;
}

/*** Action Union ***/
export type GenerateWalletAction =
  | GenerateNewWalletAction
  | ContinueToPaperAction
  | ResetGenerateWalletAction;
