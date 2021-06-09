import {
  HardwareWalletInitArgs,
  ViewOnlyWalletInitArgs,
  WalletConnectWalletInitArgs,
  WalletId,
  Web3WalletInitArgs
} from '@types';

import { ChainCodeResponse, LedgerWallet, TrezorWallet } from './deterministic';
import { AddressOnlyWallet } from './non-deterministic';
import { WalletConnectWallet } from './walletconnect';
import { unlockWeb3 } from './web3';

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
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => LedgerWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new LedgerWallet(address, dPath, index)
  },
  [WalletId.LEDGER_NANO_S]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => LedgerWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new LedgerWallet(address, dPath, index)
  },
  [WalletId.TREZOR_NEW]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => TrezorWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new TrezorWallet(address, dPath, index)
  },
  [WalletId.TREZOR]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => TrezorWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new TrezorWallet(address, dPath, index)
  },
  [WalletId.VIEW_ONLY]: {
    init: ({ address }: ViewOnlyWalletInitArgs) => new AddressOnlyWallet(address)
  },
  [WalletId.WALLETCONNECT]: {
    init: ({ address, signMessageHandler, killHandler }: WalletConnectWalletInitArgs) =>
      new WalletConnectWallet(address, signMessageHandler, killHandler)
  }
};
