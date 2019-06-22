import MyCryptoProvider from 'v2/config/networks/providerHandler';
import { ExtendedAccount } from 'v2/services/Account/types';
import { Network } from 'v2/services/Network/types';

export function getNonce(network: Network, account: ExtendedAccount) {
  const provider = new MyCryptoProvider(network);
  return provider.getTransactionCount(account.address);
}
