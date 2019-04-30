export enum WalletActions {
  UNLOCK_WEB3 = 'WALLET_UNLOCK_WEB3'
}

export interface UnlockWeb3Action {
  type: WalletActions.UNLOCK_WEB3;
}
