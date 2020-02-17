import { IAccount, Network } from 'v2/types';
import { ProviderHandler } from './network';

export function getNonce(network: Network, account: IAccount) {
  const provider = new ProviderHandler(network);
  return provider.getTransactionCount(account.address);
}
