import { MiscWalletName, SecureWalletName, WalletName } from 'config';

enum WalletMode {
  READ_ONLY = 'READ_ONLY',
  UNABLE_TO_SIGN = 'UNABLE_TO_SIGN'
}

const walletModes: { [key in WalletMode]: WalletName[] } = {
  [WalletMode.READ_ONLY]: [MiscWalletName.VIEW_ONLY],
  [WalletMode.UNABLE_TO_SIGN]: [SecureWalletName.TREZOR, MiscWalletName.VIEW_ONLY]
};

export default walletModes;
