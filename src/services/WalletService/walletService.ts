import { GridPlusWallet, LedgerWallet, TrezorWallet } from '@mycrypto/wallets';

import {
  HardwareWalletInitArgs,
  ViewOnlyWalletInitArgs,
  WalletConnectWalletInitArgs,
  WalletId,
  Web3WalletInitArgs
} from '@types';

import { AddressOnlyWallet } from './non-deterministic';
import { WalletConnectWallet } from './walletconnect';
import { unlockWeb3 } from './web3';

const trezorManifest = {
  email: 'support@mycrypto.com',
  appUrl: 'https://app.mycrypto.com'
};

const web3 = {
  init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
};

const ledger = {
  init: ({ address, dPath, index, params }: HardwareWalletInitArgs) =>
    getWallet(WalletId.LEDGER_NANO_S_NEW, params)!.getWallet(dPath, index, address)
};

const trezor = {
  init: ({ address, dPath, index, params }: HardwareWalletInitArgs) =>
    getWallet(WalletId.TREZOR_NEW, params)!.getWallet(dPath, index, address)
};

export const WalletFactory = {
  [WalletId.WEB3]: web3,
  [WalletId.METAMASK]: web3,
  [WalletId.STATUS]: web3,
  [WalletId.FRAME]: web3,
  [WalletId.COINBASE]: web3,
  [WalletId.TRUST]: web3,
  [WalletId.LEDGER_NANO_S_NEW]: ledger,
  [WalletId.LEDGER_NANO_S]: ledger,
  [WalletId.TREZOR_NEW]: trezor,
  [WalletId.TREZOR]: trezor,
  [WalletId.GRIDPLUS]: {
    init: ({ address, dPath, index, params }: HardwareWalletInitArgs) =>
      getWallet(WalletId.GRIDPLUS, params)!.getWallet(dPath, index, address)
  },
  [WalletId.VIEW_ONLY]: {
    init: ({ address }: ViewOnlyWalletInitArgs) => new AddressOnlyWallet(address)
  },
  [WalletId.WALLETCONNECT]: {
    init: ({ address, signMessageHandler, killHandler }: WalletConnectWalletInitArgs) =>
      new WalletConnectWallet(address, signMessageHandler, killHandler)
  }
};

export const getWallet = (wallet: WalletId, params?: any) => {
  switch (wallet) {
    case WalletId.LEDGER_NANO_S_NEW:
    case WalletId.LEDGER_NANO_S:
      return new LedgerWallet();
    case WalletId.TREZOR_NEW:
    case WalletId.TREZOR:
      return new TrezorWallet(trezorManifest);
    case WalletId.GRIDPLUS:
      return new GridPlusWallet({ name: 'MyCrypto', ...(params ?? {}) });
  }
};
