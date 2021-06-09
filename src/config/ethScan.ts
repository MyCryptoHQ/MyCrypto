import { NetworkId } from '@types';

enum EthscanSupportedNetworks {
  Ethereum = 'Ethereum',
  Ropsten = 'Ropsten',
  Rinkeby = 'Rinkeby',
  Kovan = 'Kovan',
  Goerli = 'Goerli',
  MATIC = 'MATIC',
  xDAI = 'xDAI'
}

export const ETHSCAN_NETWORKS: NetworkId[] = Object.values(EthscanSupportedNetworks);
