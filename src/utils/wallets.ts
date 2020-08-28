import { WalletId, StoreAccount, TAddress } from '@types';
import { isSameAddress, isWeb3Wallet } from '@utils';

export const isViewOnlyWallet = (walletId: WalletId): boolean => walletId === WalletId.VIEW_ONLY;

const isWalletConnectWallet = (walletId: WalletId): boolean => walletId === WalletId.WALLETCONNECT;

const isMainWalletType = (walletId: WalletId): boolean =>
  !isViewOnlyWallet(walletId) && !isWeb3Wallet(walletId) && !isWalletConnectWallet(walletId);

export const isSenderAccountPresent = (
  accounts: StoreAccount[],
  addressToCheck: TAddress
): boolean =>
  accounts.some(
    ({ address, wallet }) => isSameAddress(address, addressToCheck) && !isViewOnlyWallet(wallet)
  );

export const isSenderAccountPresentAndOfMainType = (
  accounts: StoreAccount[],
  addressToCheck: TAddress
): boolean =>
  accounts.some(
    ({ address, wallet }) => isSameAddress(address, addressToCheck) && isMainWalletType(wallet)
  );
