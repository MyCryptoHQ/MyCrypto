import { KNOWLEDGE_BASE_URL as KB_URL } from 'v2/config';
import {
  SecureWalletName,
  InsecureWalletName,
  MiscWalletName,
  WalletType,
  WalletName
} from 'v2/types';
import { getWeb3ProviderInfo } from 'utils/web3';

// @ADD_ACCOUNT_TODO: Icons really belongs to the WalletButton or a WalletIcon
// component.
import LedgerSVG from 'common/assets/images/wallets/ledger.svg';
import TrezorSVG from 'common/assets/images/wallets/trezor.svg';
import SafeTSVG from 'common/assets/images/wallets/safe-t.png';
import ParitySignerSVG from 'common/assets/images/wallets/parity-signer.svg';

// STORIES serve the double purpose of generating the wallet options and
// providing a declarative way to determine the flow for each wallet.

// @TODO:
// 1. Account list is displayed with DeterministicWallets component.
// We should abstract it and add to story in order to include it in the
// step length.
// 2. Merge enums and names with the ones in common/v2/config/accountTypes.ts

const web3ProviderInfo = getWeb3ProviderInfo();

type IWalletInfo = {
  [key in WalletName]: any;
};

export const WALLET_INFO: IWalletInfo = {
  [SecureWalletName.WEB3]: {
    type: WalletType.SECURE,
    lid: web3ProviderInfo.lid,
    icon: web3ProviderInfo.icon,
    description: 'ADD_WEB3DESC',
    helpLink: `${KB_URL}/how-to/migrating/moving-from-mycrypto-to-metamask`
  },
  [SecureWalletName.LEDGER_NANO_S]: {
    type: WalletType.SECURE,
    lid: 'X_LEDGER',
    icon: LedgerSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: 'https://support.ledger.com/hc/en-us/articles/360008268594'
  },
  [SecureWalletName.TREZOR]: {
    type: WalletType.SECURE,
    lid: 'X_TREZOR',
    icon: TrezorSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: `${KB_URL}/how-to/migrating/moving-from-mycrypto-to-trezor`
  },
  [SecureWalletName.SAFE_T]: {
    type: WalletType.SECURE,
    lid: 'X_SAFE_T',
    icon: SafeTSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: 'https://www.archos.com/fr/products/crypto/faq.html'
  },
  [SecureWalletName.PARITY_SIGNER]: {
    type: WalletType.SECURE,
    lid: 'X_PARITYSIGNER',
    icon: ParitySignerSVG,
    description: 'ADD_PARITY_DESC'
  },
  [InsecureWalletName.KEYSTORE_FILE]: {
    type: WalletType.INSECURE,
    lid: 'X_KEYSTORE2',
    description: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
    helpLink: `${KB_URL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`
  },
  [InsecureWalletName.MNEMONIC_PHRASE]: {
    type: WalletType.INSECURE,
    lid: 'X_MNEMONIC',
    description: 'brain surround have swap horror cheese file distinct',
    helpLink: `${KB_URL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`
  },
  [InsecureWalletName.PRIVATE_KEY]: {
    type: WalletType.INSECURE,
    lid: 'X_PRIVKEY2',
    description: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
    helpLink: `${KB_URL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`
  },
  [MiscWalletName.VIEW_ONLY]: {
    type: WalletType.MISC,
    lid: 'VIEW_ADDR',
    description: 'ADD_VIEW_ADDRESS_DESC'
  }
};
