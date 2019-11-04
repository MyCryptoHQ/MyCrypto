import { INetwork } from 'typeFiles';
import { ENSProvider } from '../network';

export const getResolvedENSAddress = async (network: INetwork, name: string) => {
  const provider = new ENSProvider(network);
  return await provider.resolveENS(name);
};

export const getENSNameFromAddress = async (network: INetwork, address: string) => {
  const provider = new ENSProvider(network);
  return await provider.resolveENS(address);
};
