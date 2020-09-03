// @ADD_ACCOUNT_@todo: Icons really belongs to the WalletButton or a WalletIcon
// component.
import myCryptoIcon from '@assets/icons/brand/logo.svg';
import viewOnlyIcon from '@assets/images/icn-view-only.svg';
import CoinbaseWalletIcon from '@assets/images/wallets/coinbase.svg';
import FrameIcon from '@assets/images/wallets/frame.svg';
import LedgerSVG from '@assets/images/wallets/ledger.svg';
import MetamaskIcon from '@assets/images/wallets/metamask.svg';
import StatusSVG from '@assets/images/wallets/status.svg';
import TrezorSVG from '@assets/images/wallets/trezor.svg';
import TrustIcon from '@assets/images/wallets/trust-3.svg';
import WalletConnectSVG from '@assets/images/wallets/walletconnect.svg';
import Web3DefaultIcon from '@assets/images/wallets/web3-default.svg';
import { WalletId, WalletType } from '@types';
import { filterObjectOfObjects } from '@utils/filterObjectOfObjects';

import { getKBHelpArticle, HELP_ARTICLE, KB_HELP_ARTICLE } from './helpArticles';

const { MIGRATE_TO_METAMASK, MIGRATE_TO_TREZOR, WALLETCONNECT } = KB_HELP_ARTICLE;

export interface IWalletConfig {
  id: WalletId;
  name: string;
  isDeterministic: boolean;
  isSecure: boolean;
  isDesktopOnly: boolean;
  type: WalletType;
  lid: string;
  icon?: string;
  description: string;
  helpLink: string;
  install?: {
    getItLink?: string;
    googlePlay?: string;
    appStore?: string;
  };
  flags: {
    supportsNonce: boolean;
  };
}

export const WALLETS_CONFIG: Record<WalletId, IWalletConfig> = {
  [WalletId.WEB3]: {
    id: WalletId.WEB3,
    name: 'Web3',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_WEB3_DEFAULT',
    icon: Web3DefaultIcon,
    description: 'ADD_WEB3DESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK),
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.METAMASK]: {
    id: WalletId.METAMASK,
    name: 'MetaMask',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_METAMASK',
    icon: MetamaskIcon,
    description: 'ADD_WEB3DESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK),
    install: {
      getItLink: 'https://metamask.io'
    },
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.TRUST]: {
    id: WalletId.TRUST,
    name: 'Trust',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_TRUST',
    icon: TrustIcon,
    description: 'ADD_WEB3DESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK),
    install: {
      getItLink: 'https://trustwallet.com',
      appStore: 'https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
    },
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.FRAME]: {
    id: WalletId.FRAME,
    name: 'Frame',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_FRAME',
    icon: FrameIcon,
    description: 'ADD_WEB3DESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK),
    install: {
      getItLink: 'https://frame.sh/'
    },
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.STATUS]: {
    id: WalletId.STATUS,
    name: 'Status',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_STATUS',
    icon: StatusSVG,
    description: 'ADD_WEB3DESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK),
    install: {
      getItLink: 'https://status.im/'
    },
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.COINBASE]: {
    id: WalletId.COINBASE,
    name: 'Coinbase Wallet',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_COINBASE',
    icon: CoinbaseWalletIcon,
    description: 'ADD_WEB3DESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK),
    install: {
      getItLink: 'https://wallet.coinbase.com/',
      appStore: 'https://itunes.apple.com/app/coinbase-wallet/id1278383455?ls=1&mt=8',
      googlePlay: 'https://play.google.com/store/apps/details?id=org.toshi'
    },
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.LEDGER_NANO_S]: {
    id: WalletId.LEDGER_NANO_S,
    name: 'Ledger',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE,
    lid: 'X_LEDGER',
    icon: LedgerSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: HELP_ARTICLE.LEDGER,
    flags: {
      supportsNonce: true
    }
  },
  [WalletId.LEDGER_NANO_S_NEW]: {
    id: WalletId.LEDGER_NANO_S_NEW,
    name: 'Ledger',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE,
    lid: 'Ledger',
    icon: LedgerSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: HELP_ARTICLE.LEDGER,
    flags: {
      supportsNonce: true
    }
  },
  [WalletId.TREZOR]: {
    id: WalletId.TREZOR,
    name: 'Trezor',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE,
    lid: 'X_TREZOR',
    icon: TrezorSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_TREZOR),
    flags: {
      supportsNonce: true
    }
  },
  [WalletId.TREZOR_NEW]: {
    id: WalletId.TREZOR_NEW,
    name: 'Trezor',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE,
    lid: 'Trezor',
    icon: TrezorSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: getKBHelpArticle(MIGRATE_TO_TREZOR),
    flags: {
      supportsNonce: true
    }
  },
  [WalletId.VIEW_ONLY]: {
    id: WalletId.VIEW_ONLY,
    name: 'View-Only',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.MISC,
    lid: 'VIEW_ADDR',
    icon: viewOnlyIcon,
    description: 'ADD_VIEW_ADDRESS_DESC',
    helpLink: '',
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.WALLETCONNECT]: {
    id: WalletId.WALLETCONNECT,
    name: 'WalletConnect',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.WEB3,
    lid: 'X_WALLETCONNECT',
    icon: WalletConnectSVG,
    description: 'ADD_WALLETCONNECTDESC',
    helpLink: getKBHelpArticle(WALLETCONNECT),
    flags: {
      supportsNonce: false
    }
  },
  [WalletId.DESKTOP_SIGNER]: {
    id: WalletId.DESKTOP_SIGNER,
    name: 'Desktop Signer',
    isDeterministic: false,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.MISC,
    lid: 'Desktop Signer',
    icon: myCryptoIcon,
    description: '',
    helpLink: '',
    flags: {
      supportsNonce: false
    }
  }
};

// @todo research Pick with dynamic keys for better type saftey.
// lead https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type WalletSubType = Partial<Record<WalletId, IWalletConfig>>;

export const HD_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)('isDeterministic');
export const SECURE_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)('isSecure');
export const INSECURE_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)(
  ({ isSecure }: { isSecure: boolean }) => !isSecure
);
export const HARDWARE_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)(
  ({ type }: { type: WalletType }) => type === WalletType.HARDWARE
);
export const WEB3_WALLETS: WalletSubType = filterObjectOfObjects(WALLETS_CONFIG)(
  ({ type }: { type: WalletType }) => type === WalletType.WEB3
);

export const getWalletConfig = (walletId: WalletId): IWalletConfig => WALLETS_CONFIG[walletId];
