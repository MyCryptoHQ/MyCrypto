import { ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';
import MyCryptoProvider from './providerHandler';
import { PROVIDER_OPTIONS } from './providerOptions';

export type NetworkKey = keyof typeof PROVIDER_OPTIONS;

type TempProviders = { [K in NetworkKey]: BaseProvider[] };
type Providers = { [K in NetworkKey]: MyCryptoProvider };

// tslint:disable-next-line
function entries<T, K extends keyof T>(obj: { [K in keyof T]: T[K] }): [K, T[K]][] {
  return Object.entries(obj) as any;
}
//this should be tested
function createFallBackProvidersFrom(config: typeof PROVIDER_OPTIONS): Providers {
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

  const mycryptoProviders: Providers = {} as Providers;
  for (const [networkKey, providers] of entries(tempProviders)) {
    mycryptoProviders[networkKey] = new MyCryptoProvider(providers);
  }
  return mycryptoProviders;
}

//allProviders are by default fallBackProviders, ex. allProviders.Ethereum -> will have main node (MyCrypto), and 2 fallback nodes
export const allProviders: Providers = createFallBackProvidersFrom(PROVIDER_OPTIONS);

//these types need to be extracted into their own folder
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;
type ProviderMethod = SubType<MyCryptoProvider, (...args: any) => any>;

async function callMultiProviderMethod<K extends keyof ProviderMethod>(
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

export default callMultiProviderMethod;
