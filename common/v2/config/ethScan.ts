import { NetworkId } from 'v2/types';

enum EthscanSupportedNetworks {
  Homestead = 'Homestead'
}

export const ETHSCAN_NETWORKS: NetworkId[] = Object.values(EthscanSupportedNetworks);
