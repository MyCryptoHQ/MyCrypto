import { IWalletConfig, WALLETS_CONFIG } from '@config';
import { WalletId, WalletType } from '@types';

export function getWeb3Config(): IWalletConfig {
  if (
    typeof window === 'undefined' ||
    (typeof (window as CustomWindow).ethereum === 'undefined' &&
      typeof (window as CustomWindow).web3 === 'undefined')
  ) {
    return WALLETS_CONFIG.WEB3;
  }
  // Web3 browser user detected. You can now use the provider.
  const provider =
    (window as CustomWindow).ethereum || (window as CustomWindow).web3.currentProvider;

  if (provider.isMetaMask) return WALLETS_CONFIG.METAMASK;

  if (provider.isFrame) return WALLETS_CONFIG.FRAME;

  if (provider.isTrust) return WALLETS_CONFIG.TRUST;

  if (provider.isToshi) return WALLETS_CONFIG.COINBASE;

  return WALLETS_CONFIG.WEB3;
}

export const isWeb3Wallet = (walletId: WalletId): boolean => {
  return WALLETS_CONFIG[walletId].type === WalletType.WEB3;
};
