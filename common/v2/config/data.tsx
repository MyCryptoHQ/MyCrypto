import React from 'react'; // For ANNOUNCEMENT_MESSAGE jsx

import { makeExplorer } from 'v2/services/EthService/utils/makeExplorer';
import packageJson from '../../../package.json';
import translate from 'v2/translations';

export const languages = require('./languages.json');

export const discordURL = 'https://discord.gg/VSaTXEA';

// Displays in the footer
export const VERSION = packageJson.version;
export const N_FACTOR = 8192;

// Displays at the top of the site, make message empty string to remove.
// Type can be primary, warning, danger, success, info, or blank for grey.
// Message must be a JSX element if you want to use HTML.
export const ANNOUNCEMENT_TYPE = '';
export const ANNOUNCEMENT_MESSAGE = (
  <React.Fragment>{translate('ANNOUNCEMENT_MESSAGE')}</React.Fragment>
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
  REP: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  XMR:
    '4GdoN7NCTi8a5gZug7PrwZNKjvHFmKeV11L6pNJPgj5QNEHsN6eeX3DaAQFwZ1ufD4LYCZKArktt113W7QjWvQ7CW7F7tDFvS511SNfZV7'
};

export const gasEstimateCacheTime = 60000;

export const MINIMUM_PASSWORD_LENGTH = 12;

export const LATEST_NEWS_URL = 'https://medium.com/@mycrypto';
export const CRYPTOSCAMDB = 'https://cryptoscamdb.org';
export const KNOWLEDGE_BASE_URL = 'https://support.mycrypto.com';
export const HOW_TO_BUY_CRYPTO_URL =
  'https://support.mycrypto.com/how-to/getting-started/how-to-buy-ether-with-usd';
export const DONT_LOSE_CRYPTO_URL =
  'https://support.mycrypto.com/staying-safe/protecting-yourself-and-your-funds';
export const STAYING_SAFE_URL = 'https://support.mycrypto.com/staying-safe';
export const ledgerReferralURL = 'https://www.ledgerwallet.com/r/1985?path=/products/';
export const trezorReferralURL = 'https://shop.trezor.io/?offer_id=10&aff_id=1735';
// TODO - Update url
export const safeTReferralURL =
  'https://www.archos.com/fr/products/crypto/archos_safetmini/index.html';
export const bitboxReferralURL = 'https://digitalbitbox.com/?ref=mycrypto';
// TODO - Update url, this is MEW's
export const bityReferralURL = 'https://bity.com/af/jshkb37v';
export const ethercardReferralURL =
  'https://ether.cards/?utm_source=mycrypto&utm_medium=cpm&utm_campaign=site';
export const keepkeyReferralURL = 'https://keepkey.go2cloud.org/aff_c?offer_id=1&aff_id=4086';
export const steelyReferralURL = 'https://stee.ly/2Hcl4RE';
export const DEXAG_PROXY_CONTRACT = '0xA65440C4CC83D70b44cF244a0da5373acA16a9cb';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export type ThemeType = 'dark' | 'light';
