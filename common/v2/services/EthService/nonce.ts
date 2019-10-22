import { ExtendedAccount, Network } from 'v2/types';
import { ProviderHandler } from './network';

export function getNonce(network: Network, account: ExtendedAccount) {
  const provider = new ProviderHandler(network);
  return provider.getTransactionCount(account.address);
}
