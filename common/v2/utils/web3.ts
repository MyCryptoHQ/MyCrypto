import MetamaskIcon from 'common/assets/images/wallets/metamask-2.svg';
import MistIcon from 'assets/images/wallets/mist.svg';
import CipherIcon from 'assets/images/wallets/cipher.svg';
import TrustIcon from 'assets/images/wallets/trust.svg';
import Web3DefaultIcon from 'assets/images/wallets/web3-default.svg';

interface Web3ProviderInfo {
  lid: string;
  icon: string;
}

const WEB3_CONFIGS: {
  [classname: string]: Web3ProviderInfo;
} = {
  CipherProvider: {
    lid: 'X_CIPHER',
    icon: CipherIcon
  },
  MetamaskInpageProvider: {
    lid: 'X_METAMASK',
    icon: MetamaskIcon
  },
  InpageBridge: {
    // MetaMask Mobile has the web3.currentProvider.constructor.name as InpageBridge
    lid: 'X_METAMASK',
    icon: MetamaskIcon
  },
  EthereumProvider: {
    lid: 'X_MIST',
    icon: MistIcon
  },
  TrustWeb3Provider: {
    lid: 'X_TRUST',
    icon: TrustIcon
  },
  UnIndentifiedWeb3Provider: {
    lid: 'X_WEB3_DEFAULT',
    icon: Web3DefaultIcon
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
