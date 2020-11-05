import { fNetwork } from '@fixtures';
import { WalletId } from '@types';

import { isWalletSupported } from './helpers';

describe('isWalletSupported()', () => {
  test('it returns true if network supports walletId', () => {
    expect(isWalletSupported(WalletId.TREZOR, fNetwork)).toBe(true);
  });

  test('it returns true if walletId is not an HD_WALLET', () => {
    expect(isWalletSupported(WalletId.METAMASK, fNetwork)).toBe(true);
  });

  test('it returns false if walletId is an unsupported HD_WALLET', () => {
    expect(isWalletSupported(WalletId.TREZOR_NEW, fNetwork)).toBe(false);
  });
});
