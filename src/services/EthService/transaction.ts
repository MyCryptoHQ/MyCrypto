import { Network, ITxHash } from '@types';
import { ProviderHandler } from './network';

export function getTransactionByHash(network: Network, hash: ITxHash) {
  const provider = new ProviderHandler(network);
  return provider.getTransactionByHash(hash);
}
