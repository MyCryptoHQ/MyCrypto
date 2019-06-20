import { ExtendedAccount } from 'v2/services/Account/types';
import { Network } from 'v2/services/Network/types';
import ProviderHandler from 'v2/config/networks/providerHandler';

export function getNonce(network: Network, account: ExtendedAccount) {
  const provider = new ProviderHandler(network);
  return provider.getTransactionCount(account.address);
}
