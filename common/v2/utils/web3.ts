import MetamaskIcon from 'common/assets/images/wallets/metamask-2.svg';
import MistIcon from 'assets/images/wallets/mist.svg';
import CipherIcon from 'assets/images/wallets/cipher.svg';
import TrustIcon from 'assets/images/wallets/trust.svg';
import Web3DefaultIcon from 'assets/images/wallets/web3-default.svg';
import FrameIcon from 'assets/images/wallets/frame.svg';
import { IWalletConfig, WALLETS_CONFIG } from 'v2/config';
import { WalletId, WalletType } from 'v2/types';

interface Web3ProviderInfo {
  lid: string;
  icon: string;
  walletId: WalletId;
}

const WEB3_CONFIGS: {
  [classname: string]: Web3ProviderInfo;
} = {
  CipherProvider: {
    lid: 'X_CIPHER',
    icon: CipherIcon,
    walletId: WalletId.CIPHER
  },
  MetamaskInpageProvider: {
    lid: 'X_METAMASK',
    icon: MetamaskIcon,
    walletId: WalletId.METAMASK
  },
  InpageBridge: {
    // MetaMask Mobile has the web3.currentProvider.constructor.name as InpageBridge
    lid: 'X_METAMASK',
    icon: MetamaskIcon,
    walletId: WalletId.METAMASK
  },
  EthereumProvider: {
    lid: 'X_MIST',
    icon: MistIcon,
    walletId: WalletId.MIST
  },
  TrustWeb3Provider: {
    lid: 'X_TRUST',
    icon: TrustIcon,
    walletId: WalletId.TRUST
  },
  a: {
    lid: 'X_FRAME',
    icon: FrameIcon,
    walletId: WalletId.FRAME
  },
  UnIndentifiedWeb3Provider: {
    lid: 'X_WEB3_DEFAULT',
    icon: Web3DefaultIcon,
    walletId: WalletId.METAMASK // Default to metamask handler?
  }
};

export function getWeb3ProviderInfo(): Web3ProviderInfo {
  if (typeof window === 'undefined') {
    return WEB3_CONFIGS.UnIndentifiedWeb3Provider;
  }

  const className =
    ((window as any).web3 && (window as any).web3.currentProvider.constructor.name) || undefined;

  return className && WEB3_CONFIGS[className]
    ? WEB3_CONFIGS[className]
    : WEB3_CONFIGS.UnIndentifiedWeb3Provider;
}

export const getWeb3Config = (): IWalletConfig => {
  return WALLETS_CONFIG[getWeb3ProviderInfo().walletId];
};

export const isWeb3Wallet = (walletId: WalletId): boolean => {
  return WALLETS_CONFIG[walletId].type === WalletType.WEB3;
};
