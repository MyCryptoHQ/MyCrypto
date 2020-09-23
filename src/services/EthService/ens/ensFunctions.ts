import { Network } from '@types';

import { ENSProvider } from '../network';

export const getResolvedENSAddress = async (network: Network, name: string) => {
  const provider = new ENSProvider(network);
  return await provider.resolveENS(name);
};

export const getENSNameFromAddress = async (network: Network, address: string) => {
  const provider = new ENSProvider(network);
  return await provider.resolveENS(address);
};
