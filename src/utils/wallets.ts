import { NetworkId, StoreAccount, TAddress, WalletId } from '@types';
import { isSameAddress } from '@utils';

export const getAccountsInNetwork = (accounts: StoreAccount[], networkId: NetworkId) =>
  accounts.filter((acc) => acc.networkId === networkId && !isViewOnlyWallet(acc.wallet));

export const isViewOnlyWallet = (walletId: WalletId): boolean => walletId === WalletId.VIEW_ONLY;

export const isHardwareWallet = (walletId: WalletId): boolean =>
  walletId === WalletId.LEDGER_NANO_S ||
  walletId === WalletId.LEDGER_NANO_S_NEW ||
  walletId === WalletId.TREZOR ||
  walletId === WalletId.TREZOR_NEW;

export const isSenderAccountPresent = (
  accounts: StoreAccount[],
  addressToCheck: TAddress
): boolean =>
  accounts.some(
    ({ address, wallet }) => isSameAddress(address, addressToCheck) && !isViewOnlyWallet(wallet)
  );
