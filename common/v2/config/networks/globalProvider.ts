import { ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';
import { PROVIDER_OPTIONS } from './providerOptions';
import { Network } from 'v2/services/Network/types';
import { isUrl } from 'v2/libs/helpers';

export type NetworkKey = keyof typeof PROVIDER_OPTIONS;

type FallbackProvider = ethers.providers.FallbackProvider;
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
      if (url) {
        if (url.includes('etherscan')) {
          const network = url.split('+')[1];
          tempProviders[networkKey].push(new ethers.providers.EtherscanProvider(network));
        } else {
          tempProviders[networkKey].push(new ethers.providers.JsonRpcProvider(url));
        }
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

export const allProviders: FallbackProviders = createFallBackProvidersFrom(PROVIDER_OPTIONS);

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

type ProviderMethod = SubType<FallbackProvider, (...args: any) => any>;

async function callProviderMethod<K extends keyof ProviderMethod>(
  method: K,
  args: { [NetworkName in NetworkKey]?: Parameters<ProviderMethod[K]> }
) {
  const arrayOfResults = [];
  for (const network of Object.keys(args)) {
    const provider = allProviders[network as NetworkKey];
    const argsForNetwork: any = args[network as NetworkKey];
    arrayOfResults.push(await (provider[method] as any)(...argsForNetwork));
  }
  return arrayOfResults;
}

export default callProviderMethod;
