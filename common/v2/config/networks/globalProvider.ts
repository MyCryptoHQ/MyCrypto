import { ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';
import { PROVIDER_OPTIONS } from './providerOptions';

type NetworkKey = keyof typeof PROVIDER_OPTIONS;

type FallbackProvider = ethers.providers.FallbackProvider;
const FallbackProvider = ethers.providers.FallbackProvider;

type TempProviders = { [K in NetworkKey]: BaseProvider[] };
type FallbackProviders = { [K in NetworkKey]: FallbackProvider };

//@ts-ignore
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
      if (url.includes('etherscan')) {
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
export const allProviders = createFallBackProvidersFrom(PROVIDER_OPTIONS);

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

type ProviderMethod = SubType<FallbackProvider, (...args: any) => any>;

export default async function callProviderMethod<K extends keyof ProviderMethod>(
  method: K,
  args: { [Network in NetworkKey]?: Parameters<ProviderMethod[K]> }
) {
  for (const network of Object.keys(args)) {
    const provider = allProviders[network as NetworkKey];
    const argsForNetwork: any = args[network as NetworkKey];
    const result = await (provider[method] as any)(...argsForNetwork);
    console.log(result);
  }
}

//example
callProviderMethod('getBalance', {
  Ethereum: ['0xceFB24f90dE062Ee1DaB076516E41993EC5c7FA8'],
  Kovan: ['0xceFB24f90dE062Ee1DaB076516E41993EC5c7FA8', 'latest']
});
