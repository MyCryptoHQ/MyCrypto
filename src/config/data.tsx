import React from 'react'; // For ANNOUNCEMENT_MESSAGE jsx

import { makeExplorer } from '@services/EthService/utils/makeExplorer';
import translate from '@translations';
import { TURL } from '@types';

import packageJson from '../../package.json';

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

export const PROTECTED_TX_FEE_ADDRESS = '0xe9c593dc6FaDC38401896C21987E2976f0AF6914';
export const PROTECTED_TX_FIXED_FEE_AMOUNT = 0.5; // Fixed half dollar fee
export const PROTECTED_TX_FEE_PERCENTAGE = 0.001; // 1 / 1000 percentage
export const PROTECTED_TX_MIN_AMOUNT = 5; // 5 dollars minimum fee

export const gasEstimateCacheTime = 60000;

export const MINIMUM_PASSWORD_LENGTH = 12;

export const SUPPORT_EMAIL = 'support@mycrypto.com';
export const LATEST_NEWS_URL = 'https://medium.com/@mycrypto' as TURL;
export const CRYPTOSCAMDB = 'https://cryptoscamdb.org';

// Handler address will change if the trade contract changes.
// Can also access handler by calling `approvalHandler()` on the trade contract.
// Also update eth contracts when updating DexAG addresses
export const DEXAG_MYC_TRADE_CONTRACT = '0x3d7b19C37d422B43c07C7Ba6353ED2D1689540FD'; //'0xA65440C4CC83D70b44cF244a0da5373acA16a9cb';
export const DEXAG_MYC_HANDLER_CONTRACT = '0xae0A30ac8C76d85f1E76A3EbDcEdc3047e0da456';
export const DEX_BASE_URL = 'https://api-v2.dex.ag/';

export const MOONPAY_PUBLIC_API_KEY = 'pk_live_Fi1kufUL8EflbE49vbZRKa71S2a4Y1D';
export const MOONPAY_API_QUERYSTRING = `?apiKey=${MOONPAY_PUBLIC_API_KEY}&colorCode=%23163150`;
export const BUY_MYCRYPTO_WEBSITE = 'https://buy.mycrypto.com' as TURL;
export const MOONPAY_SIGNER_API = 'https://moonpay.mycryptoapi.com/sign';

export const LETS_ENCRYPT_URL = 'https://letsencrypt.org/';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export type ThemeType = 'dark' | 'light';
