import { knowledgeBaseURL as KB_URL } from 'config';
import {
  DefaultWalletName,
  SecureWalletName,
  InsecureWalletName,
  MiscWalletName
} from 'v2/config/data';
import { getWeb3ProviderInfo } from 'utils/web3';
import { IS_ELECTRON, HAS_WEB3_PROVIDER } from './flags';
import { WalletType } from './types';
import {
  InsecureWalletWarning,
  LedgerNanoSDecrypt,
  KeystoreDecrypt,
  MnemonicDecrypt,
  NetworkSelectPanel,
  ParitySignerDecrypt,
  PrivateKeyDecrypt,
  SafeTminiDecrypt,
  SaveAndRedirect,
  TrezorDecrypt,
  ViewOnlyDecrypt,
  WalletList,
  Web3ProviderDecrypt,
  Web3ProviderInstall
} from './components';

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

export const STORIES = [
  {
    name: DefaultWalletName.DEFAULT,
    steps: [WalletList],
    hideFromWalletList: true
  },
  {
    name: SecureWalletName.WEB3,
    type: WalletType.SECURE,
    lid: web3ProviderInfo.lid,
    icon: web3ProviderInfo.icon,
    description: 'ADD_WEB3DESC',
    helpLink: `${KB_URL}/how-to/migrating/moving-from-mycrypto-to-metamask`,
    steps: HAS_WEB3_PROVIDER
      ? [NetworkSelectPanel, Web3ProviderDecrypt, SaveAndRedirect]
      : [Web3ProviderInstall]
  },
  {
    name: SecureWalletName.LEDGER_NANO_S,
    type: WalletType.SECURE,
    lid: 'X_LEDGER',
    icon: LedgerSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: 'https://support.ledger.com/hc/en-us/articles/360008268594',
    steps: [NetworkSelectPanel, LedgerNanoSDecrypt, SaveAndRedirect]
  },
  {
    name: SecureWalletName.TREZOR,
    type: WalletType.SECURE,
    lid: 'X_TREZOR',
    icon: TrezorSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: `${KB_URL}/how-to/migrating/moving-from-mycrypto-to-trezor`,
    steps: [NetworkSelectPanel, TrezorDecrypt, SaveAndRedirect]
  },
  {
    name: SecureWalletName.SAFE_T,
    type: WalletType.SECURE,
    lid: 'X_SAFE_T',
    icon: SafeTSVG,
    description: 'ADD_HARDWAREDESC',
    helpLink: 'https://www.archos.com/fr/products/crypto/faq.html',
    steps: [NetworkSelectPanel, SafeTminiDecrypt, SaveAndRedirect]
  },
  {
    name: SecureWalletName.PARITY_SIGNER,
    type: WalletType.SECURE,
    lid: 'X_PARITYSIGNER',
    icon: ParitySignerSVG,
    description: 'ADD_PARITY_DESC',
    steps: [NetworkSelectPanel, ParitySignerDecrypt, SaveAndRedirect]
  },
  {
    name: InsecureWalletName.KEYSTORE_FILE,
    type: WalletType.INSECURE,
    lid: 'X_KEYSTORE2',
    description: 'UTC--2017-12-15T17-35-22.547Z--6be6e49e82425a5aa56396db03512f2cc10e95e8',
    steps: [
      NetworkSelectPanel,
      IS_ELECTRON ? KeystoreDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    helpLink: `${KB_URL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`,
    hideFromWalletList: !IS_ELECTRON
  },
  {
    name: InsecureWalletName.MNEMONIC_PHRASE,
    type: WalletType.INSECURE,
    lid: 'X_MNEMONIC',
    description: 'brain surround have swap horror cheese file distinct',
    helpLink: `${KB_URL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`,
    steps: [
      NetworkSelectPanel,
      IS_ELECTRON ? MnemonicDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: !IS_ELECTRON
  },
  {
    name: InsecureWalletName.PRIVATE_KEY,
    type: WalletType.INSECURE,
    lid: 'X_PRIVKEY2',
    description: 'f1d0e0789c6d40f399ca90cc674b7858de4c719e0d5752a60d5d2f6baa45d4c9',
    helpLink: `${KB_URL}/general-knowledge/ethereum-blockchain/difference-between-wallet-types`,
    steps: [
      NetworkSelectPanel,
      IS_ELECTRON ? PrivateKeyDecrypt : InsecureWalletWarning,
      SaveAndRedirect
    ],
    hideFromWalletList: !IS_ELECTRON
  },
  {
    name: MiscWalletName.VIEW_ONLY,
    type: WalletType.MISC,
    lid: 'VIEW_ADDR',
    description: 'ADD_VIEW_ADDRESS_DESC',
    steps: [NetworkSelectPanel, ViewOnlyDecrypt, SaveAndRedirect]
  }
];
