import { WALLET_STEPS } from '@components/SignTransactionWallets';
import { NetworkId, StoreAccount } from '@types';

export const getAccountsInNetwork = (accounts: StoreAccount[], networkId: NetworkId) =>
  accounts.filter((acc) => acc.networkId === networkId && WALLET_STEPS[acc.wallet]);
