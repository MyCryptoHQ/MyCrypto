import { IWalletConfig, WALLETS_CONFIG } from 'v2/config';
import { WalletId, WalletType, Web3WalletId } from 'v2/types';

import MetamaskIcon from 'common/assets/images/wallets/metamask.svg';
import TrustIcon from 'assets/images/wallets/trust.svg';
import Web3DefaultIcon from 'assets/images/wallets/web3-default.svg';
import FrameIcon from 'assets/images/wallets/frame.svg';

interface Web3ProviderInfo {
  lid: string;
  icon: string;
  walletId: WalletId;
}

const WEB3_CONFIGS = {
  [WalletId.METAMASK]: {
    lid: 'X_METAMASK',
    icon: MetamaskIcon,
    walletId: WalletId.METAMASK
  },
  [WalletId.TRUST]: {
    lid: 'X_TRUST',
    icon: TrustIcon,
    walletId: WalletId.TRUST
  },
  [WalletId.FRAME]: {
    lid: 'X_FRAME',
    icon: FrameIcon,
    walletId: WalletId.FRAME
  },
  [WalletId.WEB3]: {
    lid: 'X_WEB3_DEFAULT',
    icon: Web3DefaultIcon,
    walletId: WalletId.WEB3
  }
} as Record<Web3WalletId, Web3ProviderInfo>;

export function getWeb3ProviderInfo(): Web3ProviderInfo {
  if (
    typeof window === 'undefined' ||
    (typeof window.ethereum === 'undefined' && typeof window.web3 === 'undefined')
  ) {
    return WEB3_CONFIGS.WEB3;
  }
  // Web3 browser user detected. You can now use the provider.
  const provider = window.ethereum || window.web3.currentProvider;

  if (provider.isMetaMask) return WEB3_CONFIGS.METAMASK;

  if (provider.isFrame) return WEB3_CONFIGS.FRAME;

  if (provider.isTrust) return WEB3_CONFIGS.TRUST;

  return WEB3_CONFIGS.WEB3;
}

export const getWeb3Config = (): IWalletConfig => WALLETS_CONFIG[getWeb3ProviderInfo().walletId];

export const isWeb3Wallet = (walletId: WalletId): boolean => {
  return WALLETS_CONFIG[walletId].type === WalletType.WEB3;
};
