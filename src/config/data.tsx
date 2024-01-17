import { NetworkId, TURL } from '@types';

import { IS_DEV } from '../../environment';
import packageJson from '../../package.json';

// Displays in the footer
export const VERSION = packageJson.version;
export const N_FACTOR = 8192;

const etherScan = 'https://etherscan.io';
const blockChainInfo = 'https://blockchain.info';
export const ETHPLORER_URL = 'https://ethplorer.io';

export const ETHTxExplorer = (txHash: string): string => `${etherScan}/tx/${txHash}`;
export const BTCTxExplorer = (txHash: string): string => `${blockChainInfo}/tx/${txHash}`;
export const ETHAddressExplorer = (address: string): string => `${etherScan}/address/${address}`;

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

export const SUPPORT_EMAIL = 'support@mycrypto.com';
export const LATEST_NEWS_URL = 'https://blog.mycrypto.com' as TURL;
export const CRYPTOSCAMDB = 'https://cryptoscamdb.org';

export const DEX_BASE_URLS: Partial<Record<NetworkId, string>> = {
  Ethereum: 'https://swap.mycryptoapi.com/',
  SmartChain: 'https://bsc.swap.mycryptoapi.com',
  MATIC: 'https://polygon.swap.mycryptoapi.com',
  ...(IS_DEV ? { Kovan: 'https://kovan.swap.mycryptoapi.com' } : {})
};
export const DEX_NETWORKS = Object.keys(DEX_BASE_URLS);
export const DEX_FEE_RECIPIENT = '0xD8D46494e200Fa585FC98f86e6A5Ea0DC1F18aD0';
export const DEX_TRADE_EXPIRATION = 31; // in seconds

export const MOONPAY_PUBLIC_API_KEY = 'pk_live_Fi1kufUL8EflbE49vbZRKa71S2a4Y1D';
export const MOONPAY_API_QUERYSTRING = `?apiKey=${MOONPAY_PUBLIC_API_KEY}&colorCode=%23163150`;
export const BUY_MYCRYPTO_WEBSITE = 'https://buy.mycrypto.com' as TURL;
export const MOONPAY_SIGNER_API = 'https://moonpay.mycryptoapi.com/sign';
export const UNISWAP_UNI_CLAIM_API = 'https://uni.mycryptoapi.com/claims';
export const UNISWAP_TOKEN_DISTRIBUTOR = '0x090D4613473dEE047c3f2706764f49E0821D256e';
export const DAPPNODE_CLAIM_API = 'https://dappnode.mycryptoapi.com/claims';
export const DAPPNODE_TOKEN_DISTRIBUTOR = '0x87d6180b65ad76a9443064dcd1596388fcc3ee2a';
export const ENS_CLAIM_API = 'https://ensclaims.mycryptoapi.com/v1/claims';
export const ENS_TOKEN_DISTRIBUTOR = '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72';
export const GIV_CLAIM_API = 'https://giveth.mycryptoapi.com/v1/claims';
export const GIV_TOKEN_DISTRIBUTOR = '0xFad63adEFb8203F7605F25f6a921c8bf45604A5e';

export const LETS_ENCRYPT_URL = 'https://letsencrypt.org/';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export type ThemeType = 'dark' | 'light';

export const FAUCET_NETWORKS: NetworkId[] = ['Ropsten', 'Rinkeby', 'Kovan', 'Goerli'];

export const ETHEREUM_NETWORKS: NetworkId[] = ['Ethereum', 'Ropsten', 'Rinkeby', 'Kovan', 'Goerli'];

export const SUPPORTED_VIDEO_EXTENSIONS = ['mov', 'mp4', 'webm', 'ogv'];

export const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'ogg', 'wav'];
