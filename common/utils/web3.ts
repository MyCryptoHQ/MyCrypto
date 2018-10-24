import MetamaskIcon from 'assets/images/wallets/metamask.svg';
import MistIcon from 'assets/images/wallets/mist.svg';
import CipherIcon from 'assets/images/wallets/cipher.svg';
import TrustIcon from 'assets/images/wallets/trust.svg';

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
  EthereumProvider: {
    lid: 'X_MIST',
    icon: MistIcon
  },
  TrustWeb3Provider: {
    lid: 'X_TRUST',
    icon: TrustIcon
  }
};

const DEFAULT_WEB3_CONFIG: Web3ProviderInfo = {
  lid: 'X_WEB3',
  icon: ''
};

export function getWeb3ProviderInfo(): Web3ProviderInfo {
  if (typeof window === 'undefined') {
    return DEFAULT_WEB3_CONFIG;
  }

  const className = (window as any).web3 && (window as any).web3.currentProvider.constructor.name;
  if (className && WEB3_CONFIGS[className]) {
    return WEB3_CONFIGS[className];
  }

  return DEFAULT_WEB3_CONFIG;
}
