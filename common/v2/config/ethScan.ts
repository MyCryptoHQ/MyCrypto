import { NetworkId } from 'v2/types';

enum EthscanSupportedNetworks {
  Ethereum = 'Ethereum',
  Ropsten = 'Ropsten',
  Rinkeby = 'Rinkeby',
  Kovan = 'Kovan',
  Goerli = 'Goerli'
}

export const ETHSCAN_NETWORKS: NetworkId[] = Object.values(EthscanSupportedNetworks);
