import { WalletId } from 'v2/types';
export interface DisabledWallets {
  wallets: WalletId[];
  reasons: {
    [key: string]: string;
  };
}

enum WalletMode {
  READ_ONLY = 'READ_ONLY',
  UNABLE_TO_SIGN = 'UNABLE_TO_SIGN'
}

// Duplicating reasons is kind of tedious, but saves having to run through a
// bunch of loops to format it differently
export const DISABLE_WALLETS: { [key in WalletMode]: DisabledWallets } = {
  [WalletMode.READ_ONLY]: {
    wallets: [WalletId.VIEW_ONLY],
    reasons: {
      [WalletId.VIEW_ONLY]: 'Read only is not allowed'
    }
  },
  [WalletMode.UNABLE_TO_SIGN]: {
    wallets: [WalletId.TREZOR, WalletId.SAFE_T_MINI, WalletId.VIEW_ONLY],
    reasons: {
      [WalletId.TREZOR]: 'This wallet can’t sign messages',
      [WalletId.SAFE_T_MINI]: 'This wallet can’t sign messages',
      [WalletId.VIEW_ONLY]: 'This wallet can’t sign messages'
    }
  }
};
