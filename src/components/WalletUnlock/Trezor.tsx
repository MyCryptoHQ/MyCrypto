import { TREZOR_DERIVATION_PATHS } from '@mycrypto/wallets';

import { FormData, IAccountAdditionData, WalletId } from '@types';

import { Hardware } from './Hardware';

interface OwnProps {
  formData: FormData;
  onUnlock(param: IAccountAdditionData[]): void;
}

export const Trezor = ({ formData, onUnlock }: OwnProps) => (
  <Hardware
    formData={formData}
    onUnlock={onUnlock}
    wallet={WalletId.TREZOR_NEW}
    extraDPaths={TREZOR_DERIVATION_PATHS}
  />
);
