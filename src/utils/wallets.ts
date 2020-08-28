import { WalletId, StoreAccount, TAddress } from '@types';
import { isSameAddress, isWeb3Wallet } from '@utils';

export const isViewOnlyWallet = (walletId: WalletId): boolean => walletId === WalletId.VIEW_ONLY;

export const isSenderAccountPresent = (
  accounts: StoreAccount[],
  addressToCheck: TAddress
): boolean =>
  accounts.some(
    ({ address, wallet }) =>
      isSameAddress(address, addressToCheck) && !isWeb3Wallet(wallet) && !isViewOnlyWallet(wallet)
  );
