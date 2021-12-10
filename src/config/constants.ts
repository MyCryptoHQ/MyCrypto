import { NetworkId, TTicker, TURL } from '@types';

export const INFURA_API_KEY = 'f3b4711ae677488bb3c56de93c6cab1a';

export const POCKET_API_KEY = '5f6a53d75053d3232349e41e';

export const ETHERSCAN_API_KEY = '3BJCKMTC6BY9XEJPZEQ7BIWJR4MCP94UB4';

export const MYC_API_MAINNET = 'https://api.mycryptoapi.com/eth';

export const DEFI_RESERVE_MAPPING_URL = 'https://defi.mycryptoapi.com';

export const GITHUB_RELEASE_NOTES_URL = 'https://github.com/MyCryptoHQ/MyCrypto/releases/latest' as TURL;

// The URL for Token Info API requests.
export const TOKEN_INFO_URL = 'https://api.mycryptoapi.com/tokens';

// The URL for MYC api.
export const MYC_API = 'https://mycryptoapi.com/api/v1';

export const HISTORY_API = 'https://history.mycryptoapi.com/history';

export const NANSEN_API = 'https://nansen.mycryptoapi.com/v2';

export const CUSTOM_ASSET_API = 'https://assets.mycryptoapi.com/custom';

export const ENS_MANAGER_URL = 'https://app.ens.domains';

export const FAUCET_API = 'https://faucet.mycryptoapi.com';

export const OPENSEA_API = 'https://opensea.mycryptoapi.com/api';

export const OPENSEA_IMAGE_PROXY_API = 'https://opensea.assets.mycryptoapi.com/v1';

export const OPENSEA_IMAGE_PROXY = 'https://mycryptoapi.com/api/v1/images/opensea';

export const POAP_CLAIM_API = 'https://poap.mycryptoapi.com/v1';

// The URL and site ID for the Matomo analytics instance.
export const ANALYTICS_API = 'https://analytics.mycryptoapi.com';
export const ANALYTICS_SITE_ID_PROD = 17;
export const ANALYTICS_SITE_ID_DEV = 11;

// this will be changed when we figure out networks
export const DEFAULT_NETWORK_FOR_FALLBACK = 'ropsten';

export const DEFAULT_NETWORK: NetworkId = 'Ethereum';

export const XDAI_NETWORK: NetworkId = 'xDAI';

export const POLYGON_NETWORK: NetworkId = 'MATIC';

export const DEFAULT_NETWORK_TICKER = 'ETH' as TTicker;

export const DEFAULT_ASSET_DECIMAL = 18;

export const DEFAULT_COIN_TYPE = 60;

export const MYC_DEX_COMMISSION_RATE = 0.0025;

export const CREATION_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DEFAULT_NETWORK_CHAINID = 1;

export const SECONDS_IN_MONTH = 60 * 60 * 24 * 30;

// Assets that are excluded when loading assets from asset API
// Tokens which are non-standard and/or may return Infinity value for every balance query.
export const EXCLUDED_ASSETS = [
  '1e917c91-e52b-5997-af67-2ffd01843701',
  '17da00cc-4901-5e04-87e0-f7e3cf9b382a',
  '2e96d50d-af13-5186-8ece-fc33872ab70c',
  'b1ef1841-6348-584e-a12e-ff2e3bbcd7ff',
  'd41becc2-9f3a-57e8-a60a-e93ad17d1ea7',
  'f383cc01-4942-5d0e-8442-3dbbc8cc8836'
];

export const ETH_SCAN_BATCH_SIZE = 300;

export const DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN = 5;
export const DEFAULT_GAP_TO_SCAN_FOR = 5;

export const SETTINGS_FILENAME = 'MyCrypto_Settings_File';

export const ASSET_DROPDOWN_SIZE_THRESHOLD = 150;

export const PRIVACY_POLICY_LINK = 'https://mycrypto.com/privacy/';
