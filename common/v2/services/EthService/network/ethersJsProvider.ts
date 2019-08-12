import { FallbackProvider } from 'ethers/providers';

import { Network } from 'v2/types';
import { createNetworkProviders } from './helpers';

// Singleton that handles all our network requests
// Generates FallbackProviders depending on the network.
// Should only be used through `ProviderHandler`
export class EthersJS {
  public static getEthersInstance(network: Network): FallbackProvider {
    if (!EthersJS.instance || !EthersJS.networkName) {
      EthersJS.instance = createNetworkProviders(network);
      EthersJS.networkName = network.name;
    }
    return EthersJS.instance;
  }

  public static updateEthersInstance(network: Network): FallbackProvider {
    EthersJS.instance = createNetworkProviders(network);
    EthersJS.networkName = network.name;
    return EthersJS.instance;
  }

  private static instance: FallbackProvider;
  private static networkName: string;

  private constructor() {}
}
