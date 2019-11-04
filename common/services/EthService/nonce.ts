import { ExtendedAccount, INetwork } from 'typeFiles';
import { ProviderHandler } from './network';

export function getNonce(network: INetwork, account: ExtendedAccount) {
  const provider = new ProviderHandler(network);
  return provider.getTransactionCount(account.address);
}
