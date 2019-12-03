export const ETHERSCAN_DEFAULT_URL = 'https://api.etherscan.io/api';

interface ApiURLS {
  [key: string]: string;
}
export const ETHERSCAN_API_URLS: ApiURLS = {
  Ethereum: 'https://api.etherscan.io/api',
  Ropsten: 'https://api-ropsten.etherscan.io/api',
  Kovan: 'https://api-kovan.etherscan.io/api',
  Rinkeby: 'https://api-rinkeby.etherscan.io/api',
  Goerli: 'https://api-goerli.etherscan.io/api'
};
