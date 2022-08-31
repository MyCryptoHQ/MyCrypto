import { DeterministicWallet, GridPlusWallet } from '@mycrypto/wallets';

import { NetworkId, StoreAccount, TAddress, WalletId } from '@types';
import { isSameAddress } from '@utils';

export const getAccountsByNetwork = (
  accounts: StoreAccount[],
  networkId: NetworkId | boolean = true
) => {
  // Return all accounts if networkId === true
  if (networkId === true) return accounts;
  return accounts.filter((acc) => acc.networkId === networkId);
};

export const getAccountsByViewOnly = (accounts: StoreAccount[], includeViewOnly?: boolean) => {
  if (includeViewOnly) return accounts;
  return accounts.filter((acc) => !isViewOnlyWallet(acc.wallet));
};

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

export const isGridPlusWallet = (wallet: DeterministicWallet): wallet is GridPlusWallet =>
  'getCredentials' in wallet;
