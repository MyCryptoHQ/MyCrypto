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

export const WalletFactory = {
  [WalletId.WEB3]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  },
  [WalletId.METAMASK]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  },
  [WalletId.STATUS]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  },
  [WalletId.FRAME]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  },
  [WalletId.COINBASE]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  },
  [WalletId.TRUST]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  },
  [WalletId.LEDGER_NANO_S_NEW]: {
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new LedgerWallet().getWallet(dPath, index, address)
  },
  [WalletId.LEDGER_NANO_S]: {
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new LedgerWallet().getWallet(dPath, index, address)
  },
  [WalletId.TREZOR_NEW]: {
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new TrezorWallet(trezorManifest).getWallet(dPath, index, address)
  },
  [WalletId.TREZOR]: {
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new TrezorWallet(trezorManifest).getWallet(dPath, index, address)
  },
  [WalletId.GRIDPLUS]: {
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new GridPlusWallet({ name: 'MyCrypto' }).getWallet(dPath, index, address)
  },
  [WalletId.VIEW_ONLY]: {
    init: ({ address }: ViewOnlyWalletInitArgs) => new AddressOnlyWallet(address)
  },
  [WalletId.WALLETCONNECT]: {
    init: ({ address, signMessageHandler, killHandler }: WalletConnectWalletInitArgs) =>
      new WalletConnectWallet(address, signMessageHandler, killHandler)
  }
};

export const getWallet = (wallet: WalletId, params?: unknown) => {
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
