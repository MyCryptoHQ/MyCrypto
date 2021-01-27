import { BaseProvider, Network } from '@ethersproject/providers';

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
        console.error('provider mismatch');
        throw new Error('provider mismatch');
      }
    } else {
      result = network;
    }
  }

  return result;
}

export class FallbackProvider extends BaseProvider {
  private _providers: Array<BaseProvider>;

  constructor(providers: Array<BaseProvider>) {
    if (providers.length === 0) {
      console.error('no providers');
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
          console.error('getNetwork returned null');
          throw new Error('getNetwork returned null');
          //errors.throwError('getNetwork returned null', errors.UNKNOWN_ERROR, {});
        }
        return networks[0];
      });

      super(ready);
    }
    //errors.checkNew(this, FallbackProvider);

    // Preserve a copy, so we don't get mutated
    this._providers = providers.slice(0);
  }

  get providers(): Array<BaseProvider> {
    // Return a copy, so we don't get mutated
    return this._providers.slice(0);
  }

  async detectNetwork(): Promise<Network> {
    const networks = await Promise.all(this.providers.map((p) => p.getNetwork()));
    return checkNetworks(networks) as Network;
  }

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
