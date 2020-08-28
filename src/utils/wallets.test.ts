import { WalletId, TAddress } from '@types';
import { fAccounts } from '@fixtures';

import { isViewOnlyWallet, isSenderAccountPresent } from './wallets';

describe('isViewOnlyWallet', () => {
  it('correctly identifies a viewOnly wallet', () => {
    expect(isViewOnlyWallet(WalletId.VIEW_ONLY)).toBeTruthy();
  });

  it('correctly identifies a non-viewOnly wallet', () => {
    expect(isViewOnlyWallet(WalletId.LEDGER_NANO_S)).toBeFalsy();
  });
});

describe('isSenderAccount', () => {
  it('correctly identifies a sender account is present', () => {
    const walletConnectSenderAddress = '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress;
    expect(isSenderAccountPresent(fAccounts, walletConnectSenderAddress)).toBeTruthy();
  });

  it('correctly identifies a sender account is not present when address is empty', () => {
    const emptySenderAddress = '' as TAddress;
    expect(isSenderAccountPresent(fAccounts, emptySenderAddress)).toBeFalsy();
  });

  it('correctly identifies a sender account is not present when account is of type viewOnly', () => {
    const viewOnlySenderAddress = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    expect(isSenderAccountPresent(fAccounts, viewOnlySenderAddress)).toBeFalsy();
  });

  it('correctly identifies a sender account is not present when account is of type web3', () => {
    const web3SenderAddress = '0x9458a933f00da9a927dbbb9cc2ae3fe7dfa9aed5' as TAddress;
    expect(isSenderAccountPresent(fAccounts, web3SenderAddress)).toBeFalsy();
  });
});
