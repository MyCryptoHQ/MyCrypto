import { Network } from '@types';
import { FallbackProvider } from '@vendor';

import { createFallbackNetworkProviders } from './helpers';

interface InstancesObject {
  [key: string]: FallbackProvider;
}

// Singleton that handles all our network requests
// Generates FallbackProviders depending on the network.
// Should only be used through `ProviderHandler`
export class EthersJS {
  public static getEthersInstance(network: Network): FallbackProvider {
    if (!EthersJS.instances[network.id]) {
      EthersJS.instances[network.id] = createFallbackNetworkProviders(network);
    }
    return EthersJS.instances[network.id];
  }

  public static updateEthersInstance(network: Network): FallbackProvider {
    EthersJS.instances[network.id] = createFallbackNetworkProviders(network);
    return EthersJS.instances[network.id];
  }

  private static instances: InstancesObject = {};

  private constructor() {}
}
