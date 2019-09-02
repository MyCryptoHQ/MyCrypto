import { NetworkId } from 'v2/types';

enum EthscanSupportedNetworks {
  Ethereum = 'Ethereum'
}

export const ETHSCAN_NETWORKS: NetworkId[] = Object.values(EthscanSupportedNetworks);
