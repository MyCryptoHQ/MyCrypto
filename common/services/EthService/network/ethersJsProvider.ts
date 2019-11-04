import { FallbackProvider } from 'ethers/providers';

import { INetwork } from 'typeFiles';
import { createNetworkProviders } from './helpers';

interface InstancesObject {
  [key: string]: FallbackProvider;
}

// Singleton that handles all our network requests
// Generates FallbackProviders depending on the network.
// Should only be used through `ProviderHandler`
export class EthersJS {
  public static getEthersInstance(network: INetwork): FallbackProvider {
    if (!EthersJS.instances[network.id]) {
      EthersJS.instances[network.id] = createNetworkProviders(network);
    }
    return EthersJS.instances[network.id];
  }

  public static updateEthersInstance(network: INetwork): FallbackProvider {
    EthersJS.instances[network.id] = createNetworkProviders(network);
    return EthersJS.instances[network.id];
  }

  private static instances: InstancesObject = {};

  private constructor() {}
}
