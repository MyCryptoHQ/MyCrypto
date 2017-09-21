import { PrivKeyWallet } from 'libs/wallet';

/*** Generate Wallet File ***/
export interface GenerateNewWalletAction {
    type: 'GENERATE_WALLET_GENERATE_WALLET';
    wallet: PrivKeyWallet;
    password: string;
}

/*** Reset Generate Wallet ***/
export interface ResetGenerateWalletAction {
    type: 'GENERATE_WALLET_RESET';
}

/*** Confirm Continue To Paper ***/
export interface ContinueToPaperAction {
    type: 'GENERATE_WALLET_CONTINUE_TO_PAPER';
}


/*** Action Union ***/
export type GenerateWalletAction =
    | GenerateNewWalletAction
    | ContinueToPaperAction
    | ResetGenerateWalletAction;