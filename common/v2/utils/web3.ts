import { IWalletConfig, WALLETS_CONFIG } from 'v2/config';
import { WalletId, WalletType } from 'v2/types';

export function getWeb3Config(): IWalletConfig {
  if (
    typeof window === 'undefined' ||
    (typeof window.ethereum === 'undefined' && typeof window.web3 === 'undefined')
  ) {
    return WALLETS_CONFIG.WEB3;
  }
  // Web3 browser user detected. You can now use the provider.
  const provider = window.ethereum || window.web3.currentProvider;

  if (provider.isMetaMask) return WALLETS_CONFIG.METAMASK;

  if (provider.isFrame) return WALLETS_CONFIG.FRAME;

  if (provider.isTrust) return WALLETS_CONFIG.TRUST;

  if (provider.isToshi) return WALLETS_CONFIG.COINBASE;

  return WALLETS_CONFIG.WEB3;
}

export const isWeb3Wallet = (walletId: WalletId): boolean => {
  return WALLETS_CONFIG[walletId].type === WalletType.WEB3;
};
