import { getValues } from '../utils/helpers';

export const languages = require('./languages.json');

// Displays in the header
export const VERSION = '4.0.0 (Alpha 0.1.0)';
export const N_FACTOR = 1024;

// Displays at the top of the site, make message empty string to remove.
// Type can be primary, warning, danger, success, or info.
// HTML is allowed inside of the message.
export const ANNOUNCEMENT_TYPE = 'warning';
export const ANNOUNCEMENT_MESSAGE = `
  This is an Alpha build of MyEtherWallet v4. Please only use for testing,
  or use v3 at <a href='https://myetherwallet.com'>https://myetherwallet.com</a>.
  <br/>
  <span class="hidden-xs">
    If you're interested in recieving updates about the MyEtherWallet V4 Alpha, you can subscribe via
    <a href="http://myetherwallet.us16.list-manage.com/subscribe?u=afced8afb6eb2968ba407a144&id=15a7c74eab">
      mailchimp
    </a>
    :)
  </span>
`;

const etherScan = 'https://etherscan.io';
const blockChainInfo = 'https://blockchain.info';
export const ethPlorer = 'https://ethplorer.io';

export const ETHTxExplorer = (txHash: string): string => `${etherScan}/tx/${txHash}`;
export const BTCTxExplorer = (txHash: string): string => `${blockChainInfo}/tx/${txHash}`;
export const ETHAddressExplorer = (address: string): string => `${etherScan}/address/${address}`;
export const ETHTokenExplorer = (address: string): string => `${ethPlorer}/address/${address}`;

export const donationAddressMap = {
  BTC: '1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6',
  ETH: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  REP: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8'
};

export const gasPriceDefaults = {
  gasPriceMinGwei: 1,
  gasPriceMaxGwei: 60
};

export const MINIMUM_PASSWORD_LENGTH = 9;

export const knowledgeBaseURL = 'https://myetherwallet.github.io/knowledge-base';
export const bityReferralURL = 'https://bity.com/af/jshkb37v';
// Note: add the real referral url once you know it
export const shapeshiftReferralURL = 'https://shapeshift.io';
export const ledgerReferralURL = 'https://www.ledgerwallet.com/r/fa4b?path=/products/';
export const trezorReferralURL = 'https://trezor.io/?a=myetherwallet.com';
export const bitboxReferralURL = 'https://digitalbitbox.com/?ref=mew';

export enum SecureWalletName {
  WEB3 = 'web3',
  LEDGER_NANO_S = 'ledgerNanoS',
  TREZOR = 'trezor'
}

export enum HardwareWalletName {
  LEDGER_NANO_S = 'ledgerNanoS',
  TREZOR = 'trezor'
}

export enum InsecureWalletName {
  PRIVATE_KEY = 'privateKey',
  KEYSTORE_FILE = 'keystoreFile',
  MNEMONIC_PHRASE = 'mnemonicPhrase'
}

export enum MiscWalletName {
  VIEW_ONLY = 'viewOnly'
}

export const walletNames = getValues(
  SecureWalletName,
  HardwareWalletName,
  InsecureWalletName,
  MiscWalletName
);

export type WalletName = SecureWalletName | InsecureWalletName | MiscWalletName;
