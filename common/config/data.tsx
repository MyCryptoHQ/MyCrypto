import React from 'react'; // For ANNOUNCEMENT_MESSAGE jsx
import NewTabLink from 'components/ui/NewTabLink';
import { getValues } from '../utils/helpers';
import packageJson from '../../package.json';
import { GasPriceSetting } from 'types/network';
import { makeExplorer } from 'utils/helpers';

export const languages = require('./languages.json');
export const discordURL = 'https://discord.gg/VSaTXEA';

// Displays in the footer
export const VERSION = `${packageJson.version} (BETA)`;
export const N_FACTOR = 8192;

// Displays at the top of the site, make message empty string to remove.
// Type can be primary, warning, danger, success, info, or blank for grey.
// Message must be a JSX element if you want to use HTML.
export const ANNOUNCEMENT_TYPE = '';
export const ANNOUNCEMENT_MESSAGE = (
  <React.Fragment>
    This is a Beta version of MyCrypto. Please submit any bug reports to our{' '}
    <NewTabLink href="https://github.com/MyCryptoHQ/MyCrypto/issues">GitHub</NewTabLink> and use{' '}
    <NewTabLink href="https://hackerone.com/mycrypto">HackerOne</NewTabLink> for critical
    vulnerabilities. Join the discussion on <NewTabLink href={discordURL}>Discord</NewTabLink>.
  </React.Fragment>
);

const etherScan = 'https://etherscan.io';
const blockChainInfo = 'https://blockchain.info';
export const ethPlorer = 'https://ethplorer.io';

export const ETHTxExplorer = (txHash: string): string => `${etherScan}/tx/${txHash}`;
export const BTCTxExplorer = (txHash: string): string => `${blockChainInfo}/tx/${txHash}`;
export const ETHAddressExplorer = (address: string): string => `${etherScan}/address/${address}`;
export const ETHTokenExplorer = (address: string): string => `${ethPlorer}/address/${address}`;

export const etherChainExplorerInst = makeExplorer({
  name: 'Etherchain',
  origin: 'https://www.etherchain.org',
  addressPath: 'account'
});

export const donationAddressMap = {
  BTC: '32oirLEzZRhi33RCXDF9WHJjEb8RsrSss3',
  ETH: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  REP: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
};

export const gasEstimateCacheTime = 60000;
export const gasPriceDefaults: GasPriceSetting = {
  min: 1,
  max: 60,
  initial: 20
};

export const MINIMUM_PASSWORD_LENGTH = 12;

export const knowledgeBaseURL = 'https://support.mycrypto.com';
export const ledgerReferralURL = 'https://www.ledgerwallet.com/r/1985?path=/products/';
export const trezorReferralURL = 'https://shop.trezor.io?a=mycrypto.com';
export const bitboxReferralURL = 'https://digitalbitbox.com/?ref=mycrypto';
// TODO - Update url, this is MEW's
export const bityReferralURL = 'https://bity.com/af/jshkb37v';
// TODO - add the real referral url once you know it
export const shapeshiftReferralURL = 'https://shapeshift.io';
export const ethercardReferralURL =
  'https://ether.cards/?utm_source=mycrypto&utm_medium=cpm&utm_campaign=site';

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
