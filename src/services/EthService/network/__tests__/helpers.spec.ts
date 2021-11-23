import { LEDGER_ETH } from '@mycrypto/wallets';

import { fNetworks } from '@fixtures';
import { WalletId } from '@types';

import {
  createCustomNodeProvider,
  createFallbackNetworkProviders,
  getDPath,
  getDPaths
} from '../helpers';

describe('getDPaths', () => {
  it('correctly handles wallet-specified dpaths', () => {
    const actual = getDPaths(fNetworks, WalletId.LEDGER_NANO_S);
    expect(actual).toStrictEqual([LEDGER_ETH]);
  });
});

describe('getDPath', () => {
  it('correctly handles wallet-specified getDPath', () => {
    const actual = getDPath(fNetworks[0], WalletId.LEDGER_NANO_S);
    expect(actual).toStrictEqual(LEDGER_ETH);
  });
});

describe('createFallbackNetworkProviders', () => {
  const fallbackProvider = createFallbackNetworkProviders(fNetworks[0]);
  it('creates a baseProvider with the network', () => {
    expect(fallbackProvider).toHaveProperty('ready');
  });

  // Fallback provider includes a list of providers to fallback to,
  // which is the main difference between fallback provider and typical ethers.js provider
  it('extends the baseProvider to be a valid fallbackProvider', () => {
    expect(fallbackProvider.providers).toHaveLength(2);
  });
});

describe('createCustomNodeProvider', () => {
  it('creates a baseProvider with the network', () => {
    const provider = createCustomNodeProvider(fNetworks[0]);
    expect(provider).toHaveProperty('ready');
  });
});
