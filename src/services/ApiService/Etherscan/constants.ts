import { NetworkId } from '@types';

export const ETHERSCAN_DEFAULT_URL = 'https://etherscan.proxy.mycryptoapi.com/v1';
export type ETHERSCAN_API_INVALID_KEY_MESSAGE = 'OK-Missing/Invalid API Key, rate limit of 1/sec applied';
export const ETHERSCAN_API_MAX_LIMIT_REACHED_TEXT =
  'Max rate limit reached, please use API Key for higher rate limit';
export type ETHERSCAN_API_MAX_LIMIT_REACHED = 'Max rate limit reached, please use API Key for higher rate limit';

type ApiURLS = Partial<
  {
    [key in NetworkId]: string;
  }
>;

export const ETHERSCAN_API_URLS: ApiURLS = {
  Ethereum: 'https://etherscan.proxy.mycryptoapi.com/v1',
  Ropsten: 'https://api-ropsten.etherscan.io/api',
  Kovan: 'https://api-kovan.etherscan.io/api',
  Rinkeby: 'https://api-rinkeby.etherscan.io/api',
  Goerli: 'https://api-goerli.etherscan.io/api'
};
