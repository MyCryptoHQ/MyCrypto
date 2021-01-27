import { BaseProvider, Network } from '@ethersproject/providers';

// Taken from new v5 ethers - https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/fallback-provider.ts
function checkNetworks(networks: Array<Network>): Network | null {
  let result = null;

  for (let i = 0; i < networks.length; i++) {
    const network = networks[i];

    // Null! We do not know our network; bail.
    if (network == null) {
      return null;
    }

    if (result) {
      // Make sure the network matches the previous networks
      if (
        !(
          result.name === network.name &&
          result.chainId === network.chainId &&
          (result.ensAddress === network.ensAddress ||
            (result.ensAddress == null && network.ensAddress == null))
        )
      ) {
        throw new Error('provider mismatch');
      }
    } else {
      result = network;
    }
  }

  return result;
}

// We use a custom version of FallbackProvider which is heavily inspired by Ethers v4 because we prefer the FallbackProvider to sequentially use providers and fall back in case of errors over trying to reach a quorum with multiple providers at once.
// Most of the magic happens in the perform function which does the fetching and falling back in case of errors.
// A few tweaks were done to support new features of Ethers v5, such as adding the detectNetwork function.
// Furthermore, the Ethers error logging was removed in favor of simply throwing errors.
export class FallbackProvider extends BaseProvider {
  private _providers: Array<BaseProvider>;

  constructor(providers: Array<BaseProvider>) {
    if (providers.length === 0) {
      throw new Error('no providers');
    }

    // All networks are ready, we can know the network for certain
    const ready = checkNetworks(providers.map((p) => p.network));
    if (ready) {
      super(providers[0].network);
    } else {
      // The network won't be known until all child providers know
      const ready = Promise.all(providers.map((p) => p.getNetwork())).then((networks) => {
        if (!checkNetworks(networks)) {
          throw new Error('getNetwork returned null');
        }
        return networks[0];
      });

      super(ready);
    }

    // Preserve a copy, so we don't get mutated
    this._providers = providers.slice(0);
  }

  // Taken from Ethers v5 - https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/fallback-provider.ts#L471-L474
  async detectNetwork(): Promise<Network> {
    const networks = await Promise.all(this.providers.map((p) => p.getNetwork()));
    return checkNetworks(networks) as Network;
  }

  // Taken from Ethers v4 - https://github.com/ethers-io/ethers.js/blob/v4-legacy/src.ts/providers/fallback-provider.ts#L77-L80
  get providers(): Array<BaseProvider> {
    // Return a copy, so we don't get mutated
    return this._providers.slice(0);
  }

  // Taken from Ethers v4 - https://github.com/ethers-io/ethers.js/blob/v4-legacy/src.ts/providers/fallback-provider.ts#L82-L104
  perform(method: string, params: { [name: string]: any }): any {
    // Creates a copy of the providers array
    const providers = this.providers;

    return new Promise((resolve, reject) => {
      let firstError: Error | null = null;
      function next() {
        if (!providers.length || providers.length === 0) {
          reject(firstError);
          return;
        }

        const provider = providers.shift();
        provider!
          .perform(method, params)
          .then((result) => {
            return resolve(result);
          })
          .catch((error) => {
            if (!firstError) {
              firstError = error;
            }
            setTimeout(next, 0);
          });
      }
      next();
    });
  }
}
