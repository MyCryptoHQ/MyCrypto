// Returns:
//  - true is all networks match
//  - false if any network is null

import { BaseProvider, Network } from '@ethersproject/providers';

//  - throws if any 2 networks do not match
function checkNetworks(networks: Array<Network>): boolean {
  let result = true;

  let check: Network | null = null;
  networks.forEach((network) => {
    // Null
    if (network == null) {
      result = false;
      return;
    }

    // Have nothing to compre to yet
    if (check == null) {
      check = network;
      return;
    }

    // Matches!
    if (
      check.name === network.name &&
      check.chainId === network.chainId &&
      (check.ensAddress === network.ensAddress ||
        (check.ensAddress == null && network.ensAddress == null))
    ) {
      return;
    }

    console.error('provider mismatch');
    throw Error('provider mismatch');
  });

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
