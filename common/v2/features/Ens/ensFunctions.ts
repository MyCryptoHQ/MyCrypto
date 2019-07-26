import { Network } from 'v2/types';
import { ENSProvider } from 'v2/config';

export const getResolvedENSAddress = async (network: Network, name: string) => {
  const provider = new ENSProvider(network);
  return await provider.resolveENS(name);
};

export const getENSNameFromAddress = async (network: Network, address: string) => {
  const provider = new ENSProvider(network);
  return await provider.resolveENS(address);
};
