import { NetworkId } from 'v2/types';

enum EthscanSupportedNetworks {
  Ethereum = 'Ethereum',
  Ropsten = 'Ropsten',
  Rinkeby = 'Rinkeby'
}

export const ETHSCAN_NETWORKS: NetworkId[] = Object.values(EthscanSupportedNetworks);
