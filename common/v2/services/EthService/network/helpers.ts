import { ethers } from 'ethers';
import { FallbackProvider, BaseProvider } from 'ethers/providers';

import { isUrl } from 'v2/utils';
import { Network, NetworkId, NodeConfig, NodeType } from 'v2/types';
import { NODES_CONFIG } from 'v2/config';

// Currently globalProvider creates either a JSONRPC or Etherscan Provider and needs
// a way to determine between both. Legacy code uses the `etherscan+<network_name>`
// as a flag to determine which one to use
type TValidEtherscanNetwork = 'ethereum' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

function makeEtherscanOption(network: TValidEtherscanNetwork) {
  // Etherscan correctly refers to the 'ethereum' network as 'homestead'.
  const etherscanNetworkOption = network === 'ethereum' ? 'homestead' : network;
  return `etherscan+${etherscanNetworkOption}`;
}

// Creates an object with a network name as key and an array of node urls as values.
// ie. {
//   Ropsten: ['https://ropsten.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'],
//   AQUA: ['https://tx.aquacha.in/api', 'https://c.onical.org'],
// }
type IProviderOptions = { [k in NetworkId]: string[] };

function getProviderOptions(nodes: typeof NODES_CONFIG) {
  return Object.entries(nodes).reduce(
    (providers, [key, value]: [NetworkId, NodeConfig[]]) => {
      providers[key] = value.map(node =>
        node.type === NodeType.ETHERSCAN
          ? makeEtherscanOption(key.toLowerCase() as TValidEtherscanNetwork)
          : node.url
      );
      return providers;
    },
    {} as IProviderOptions
  );
}

const PROVIDER_OPTIONS = getProviderOptions(NODES_CONFIG);

type TempProviders = { [K in NetworkId]: BaseProvider[] };
type FallbackProviders = { [K in NetworkId]: FallbackProvider };

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

  // Result for network with name "ethereum"
  // {
  //   "Ethereum": [
  //     "https://api.mycryptoapi.com/eth",
  //     "https://api.etherscan.io/api",
  //     "https://mainnet.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286"
  //     ]
  // }

  return createFallBackProvidersFrom(newProviderPattern)[network.name as NetworkId];
};
