import { MiscWalletName, SecureWalletName, WalletName } from 'config';

export interface DisabledWallets {
  wallets: WalletName[];
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
    wallets: [MiscWalletName.VIEW_ONLY],
    reasons: {
      [MiscWalletName.VIEW_ONLY]: 'Read only is not allowed'
    }
  },
  [WalletMode.UNABLE_TO_SIGN]: {
    wallets: [SecureWalletName.TREZOR, MiscWalletName.VIEW_ONLY],
    reasons: {
      [SecureWalletName.TREZOR]: 'This wallet can’t sign messages',
      [MiscWalletName.VIEW_ONLY]: 'This wallet can’t sign messages'
    }
  }
};
