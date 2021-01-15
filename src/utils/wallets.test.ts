import { fAccounts } from '@fixtures';
import { TAddress, WalletId } from '@types';

import {
  getAccountsInNetwork,
  isHardwareWallet,
  isSenderAccountPresent,
  isViewOnlyWallet
} from './wallets';

describe('getAccountsInNetwork', () => {
  it('filters correctly by default', () => {
    expect(getAccountsInNetwork({ accounts: fAccounts, networkId: 'Ropsten' })).toHaveLength(3);
  });

  it('includes view only when expected', () => {
    expect(
      getAccountsInNetwork({ accounts: fAccounts, networkId: 'Ropsten', includeViewOnly: true })
    ).toHaveLength(4);
  });
});

describe('isViewOnlyWallet', () => {
  it('correctly identifies a viewOnly wallet', () => {
    expect(isViewOnlyWallet(WalletId.VIEW_ONLY)).toBeTruthy();
  });

  it('correctly identifies a non-viewOnly wallet', () => {
    expect(isViewOnlyWallet(WalletId.LEDGER_NANO_S)).toBeFalsy();
  });
});

describe('isHardwareWallet', () => {
  it('correctly identifies a Ledger wallet', () => {
    expect(isHardwareWallet(WalletId.LEDGER_NANO_S)).toBeTruthy();
    expect(isHardwareWallet(WalletId.LEDGER_NANO_S_NEW)).toBeTruthy();
  });

  it('correctly identifies a Trezor wallet', () => {
    expect(isHardwareWallet(WalletId.TREZOR)).toBeTruthy();
    expect(isHardwareWallet(WalletId.TREZOR_NEW)).toBeTruthy();
  });

  it('correctly identifies a non-hardware wallet', () => {
    expect(isViewOnlyWallet(WalletId.WEB3)).toBeFalsy();
  });
});

describe('isSenderAccountPresent', () => {
  it('correctly identifies a valid sender account is present when address is of type ledger', () => {
    const ledgerSenderAccountAddress = '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress;
    expect(isSenderAccountPresent(fAccounts, ledgerSenderAccountAddress)).toBeTruthy();
  });

  it('correctly identifies a valid sender account is not present when address is empty', () => {
    const emptySenderAddress = '' as TAddress;
    expect(isSenderAccountPresent(fAccounts, emptySenderAddress)).toBeFalsy();
  });

  it('correctly identifies a validsender account is not present when account is of type viewOnly', () => {
    const viewOnlySenderAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    expect(isSenderAccountPresent(fAccounts, viewOnlySenderAddress)).toBeFalsy();
  });

  it('correctly identifies a valid sender account is  present when account is of type web3', () => {
    const web3SenderAddress = '0x9458a933f00da9a927dbbb9cc2ae3fe7dfa9aed5' as TAddress;
    expect(isSenderAccountPresent(fAccounts, web3SenderAddress)).toBeTruthy();
  });

  it('correctly identifies a valid sender account is present when account is of type walletconnect', () => {
    const walletConnectSenderAddress = '0x03a0775e92dc3ad2d2cb3eaf58af5ee99b183d49' as TAddress;
    expect(isSenderAccountPresent(fAccounts, walletConnectSenderAddress)).toBeTruthy();
  });
});
