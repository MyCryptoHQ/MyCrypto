import { ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';

import { isUrl } from 'v2/utils';
import { Network } from 'v2/types';
import { PROVIDER_OPTIONS } from './providerOptions';

export type NetworkKey = keyof typeof PROVIDER_OPTIONS;

export type FallbackProvider = ethers.providers.FallbackProvider;
const FallbackProvider = ethers.providers.FallbackProvider;

type TempProviders = { [K in NetworkKey]: BaseProvider[] };
type FallbackProviders = { [K in NetworkKey]: FallbackProvider };

// tslint:disable-next-line
function entries<T, K extends keyof T>(obj: { [K in keyof T]: T[K] }): [K, T[K]][] {
  return Object.entries(obj) as any;
}

function createFallBackProvidersFrom(config: typeof PROVIDER_OPTIONS): FallbackProviders {
  const tempProviders: TempProviders = {} as TempProviders;

  // create fallback providers
  for (const [networkKey, providerUrls] of entries(config)) {
    for (const url of providerUrls) {
      if (!tempProviders[networkKey]) {
        tempProviders[networkKey] = [];
      }
      if (url && url.includes('etherscan')) {
        const network = url.split('+')[1];
        tempProviders[networkKey].push(new ethers.providers.EtherscanProvider(network));
      } else {
        tempProviders[networkKey].push(new ethers.providers.JsonRpcProvider(url));
      }
    }
  }

  const fallBackProviders: FallbackProviders = {} as FallbackProviders;
  for (const [networkKey, providers] of entries(tempProviders)) {
    fallBackProviders[networkKey] = new ethers.providers.FallbackProvider(providers);
  }
  return fallBackProviders;
}

export const createProviderHandler = (network: Network): FallbackProvider => {
  const newProviderPattern: any = { [network.name]: [] };
  network.nodes.forEach(node => {
    if (node.url && isUrl(node.url)) {
      // Not very-well covered test for if url is a valid url (sorts out web3 nodes / non-https nodes).
      newProviderPattern[network.name].push(node.url);
    }
  });
  return createFallBackProvidersFrom(newProviderPattern)[network.name as NetworkKey];
};

export class EthersJS {
  public static getEthersInstance(network: Network): FallbackProvider {
    if (!EthersJS.instance || !EthersJS.networkName) {
      EthersJS.instance = createProviderHandler(network);
      EthersJS.networkName = network.name;
    }
    return EthersJS.instance;
  }

  public static updateEthersInstance(network: Network): FallbackProvider {
    EthersJS.instance = createProviderHandler(network);
    EthersJS.networkName = network.name;
    return EthersJS.instance;
  }

  private static instance: FallbackProvider;
  private static networkName: string;

  private constructor() {}
}

export default EthersJS;
