import { WALLETS_CONFIG } from '@config';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

export const getHeader = (wallet: WalletId) => {
  return translateRaw('SIGN_TX_TITLE', {
    $walletName: WALLETS_CONFIG[wallet].name
  });
};
