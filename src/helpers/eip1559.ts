import { Network, StoreAccount, WalletId } from '@types';

// @todo Figure out if anything else needs to be disabled?
const DISABLED_WALLETS = [
  WalletId.TREZOR,
  WalletId.TREZOR_NEW,
  WalletId.LEDGER_NANO_S,
  WalletId.LEDGER_NANO_S_NEW
];

export const isEIP1559Supported = (network: Network, account: StoreAccount) => {
  return network.supportsEIP1559 && !DISABLED_WALLETS.includes(account.wallet);
};
