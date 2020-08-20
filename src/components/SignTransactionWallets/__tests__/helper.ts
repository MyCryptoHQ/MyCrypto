import { WalletId } from '@types';
import { translateRaw } from '@translations';
import { WALLETS_CONFIG } from '@config';

export const getHeader = (wallet: WalletId) => {
  return translateRaw('SIGN_TX_TITLE', {
    $walletName: WALLETS_CONFIG[wallet].name
  });
};
