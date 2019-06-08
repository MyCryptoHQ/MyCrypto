import { ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';
import { PROVIDER_OPTIONS } from './providerOptions';

type NetworkKey = keyof typeof PROVIDER_OPTIONS;

type FallbackProvider = ethers.providers.FallbackProvider;
const FallbackProvider = ethers.providers.FallbackProvider;

type TempProviders = { [K in NetworkKey]: BaseProvider[] };
type FallbackProviders = { [K in NetworkKey]: FallbackProvider };

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
const allProviders = createFallBackProvidersFrom(PROVIDER_OPTIONS);

async function getBlock() {
  const ETHProvider = allProviders.Ethereum;
  const block = await ETHProvider.getBlockNumber();
  console.log(block);
}

getBlock();

//step 2, multinetwork calls

// interface callProviderMethodArgs {

//   method: Parameters<ethers.providers.FallbackProvider[K]>
// }

// async function callProviderMethod(providers: FallbackProviders,  args: any,  method ):  {

// }
