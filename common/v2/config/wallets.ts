import { filterObjectOfObjects } from 'v2/utils/filterObjectOfObjects';
import { WalletType, WalletId } from 'v2/types';

import { KB_HELP_ARTICLE, getKBHelpArticle, HELP_ARTICLE } from './helpArticles';

// @ADD_ACCOUNT_TODO: Icons really belongs to the WalletButton or a WalletIcon
// component.
import LedgerSVG from 'common/assets/images/wallets/ledger.svg';
import TrezorSVG from 'common/assets/images/wallets/trezor.svg';
import SafeTSVG from 'common/assets/images/wallets/safe-t.png';
import ParitySignerSVG from 'common/assets/images/wallets/parity-signer.svg';
import MetamaskIcon from 'common/assets/images/wallets/metamask.svg';
import TrustIcon from 'common/assets/images/wallets/trust-3.svg';
import Web3DefaultIcon from 'assets/images/wallets/web3-default.svg';
import FrameIcon from 'assets/images/wallets/frame.svg';
import CoinbaseWalletIcon from 'common/assets/images/wallets/coinbase.svg';
import WalletConnectSVG from 'assets/images/wallets/walletconnect.svg';
import keystoreIcon from 'assets/images/icn-keystore.svg';
import mnemonicIcon from 'assets/images/icn-create-pw.svg';
import privateKeyIcon from 'assets/images/icn-lock-safety.svg';
import viewOnlyIcon from 'assets/images/icn-view-only.svg';

const {
  MIGRATE_TO_METAMASK,
  MIGRATE_TO_TREZOR,
  DIFFERENCE_BETWEEN_PKEY_AND_KEYSTORE,
  WALLETCONNECT
} = KB_HELP_ARTICLE;

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
    helpLink: getKBHelpArticle(MIGRATE_TO_METAMASK)
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
    }
  },
  [WalletId.LEDGER_NANO_S]: {
    id: WalletId.LEDGER_NANO_S,
    name: 'Ledger Nano S',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE,
    lid: 'X_LEDGER',
    icon: LedgerSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: HELP_ARTICLE.LEDGER
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
    helpLink: getKBHelpArticle(MIGRATE_TO_TREZOR)
  },
  [WalletId.SAFE_T_MINI]: {
    id: WalletId.SAFE_T_MINI,
    name: 'Safe-T Mini',
    isDeterministic: true,
    isSecure: true,
    isDesktopOnly: false,
    type: WalletType.HARDWARE,
    lid: 'X_SAFE_T',
    icon: SafeTSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: HELP_ARTICLE.SAFE_T_MINI
  },
  [WalletId.PARITY_SIGNER]: {
    id: WalletId.PARITY_SIGNER,
    name: 'Parity Signer',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: false,
    type: WalletType.MISC,
    lid: 'X_PARITYSIGNER',
    icon: ParitySignerSVG,
    description: 'ADD_PARITY_DESC',
    helpLink: HELP_ARTICLE.PARITY
  },
  [WalletId.KEYSTORE_FILE]: {
    id: WalletId.KEYSTORE_FILE,
    name: 'JSON Keystore File',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: true,
    type: WalletType.FILE,
    lid: 'X_KEYSTORE2',
    icon: keystoreIcon,
    description: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
    helpLink: getKBHelpArticle(DIFFERENCE_BETWEEN_PKEY_AND_KEYSTORE)
  },
  [WalletId.MNEMONIC_PHRASE]: {
    id: WalletId.MNEMONIC_PHRASE,
    name: 'Mnemonic Phrase',
    isDeterministic: true,
    isSecure: false,
    isDesktopOnly: true,
    type: WalletType.FILE,
    lid: 'X_MNEMONIC',
    icon: mnemonicIcon,
    description: 'brain surround have swap horror cheese file distinct',
    helpLink: getKBHelpArticle(DIFFERENCE_BETWEEN_PKEY_AND_KEYSTORE)
  },
  [WalletId.PRIVATE_KEY]: {
    id: WalletId.PRIVATE_KEY,
    name: 'Private Key',
    isDeterministic: false,
    isSecure: false,
    isDesktopOnly: true,
    type: WalletType.FILE,
    lid: 'X_PRIVKEY2',
    icon: privateKeyIcon,
    description: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
    helpLink: getKBHelpArticle(DIFFERENCE_BETWEEN_PKEY_AND_KEYSTORE)
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
    helpLink: ''
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
    helpLink: getKBHelpArticle(WALLETCONNECT)
  }
};

// TODO research Pick with dynamic keys for better type saftey.
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
