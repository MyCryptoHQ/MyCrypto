import { NetworkId } from 'typeFiles';

enum EthscanSupportedNetworks {
  Ethereum = 'Ethereum',
  Ropsten = 'Ropsten',
  Rinkeby = 'Rinkeby',
  Kovan = 'Kovan',
  Goerli = 'Goerli'
}

export const ETHSCAN_NETWORKS: NetworkId[] = Object.values(EthscanSupportedNetworks);
