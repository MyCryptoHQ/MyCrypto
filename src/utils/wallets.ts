import { StoreAccount, TAddress, WalletId } from '@types';
import { isSameAddress } from '@utils';

export const isViewOnlyWallet = (walletId: WalletId): boolean => walletId === WalletId.VIEW_ONLY;

export const isSenderAccountPresent = (
  accounts: StoreAccount[],
  addressToCheck: TAddress
): boolean =>
  accounts.some(
    ({ address, wallet }) => isSameAddress(address, addressToCheck) && !isViewOnlyWallet(wallet)
  );
