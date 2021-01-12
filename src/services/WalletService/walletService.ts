import {
  HardwareWalletInitArgs,
  HardwareWalletService,
  ViewOnlyWalletInitArgs,
  WalletConnectWalletInitArgs,
  WalletId,
  WalletService,
  Web3WalletInitArgs
} from '@types';

import { ChainCodeResponse, LedgerWallet, TrezorWallet } from './deterministic';
import { AddressOnlyWallet } from './non-deterministic';
import { WalletConnectWallet } from './walletconnect';
import { unlockWeb3 } from './web3';

export const WalletFactory = {
  [WalletId.WEB3]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  } as WalletService,
  [WalletId.METAMASK]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  } as WalletService,
  [WalletId.FRAME]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  } as WalletService,
  [WalletId.COINBASE]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  } as WalletService,
  [WalletId.TRUST]: {
    init: ({ networks }: Web3WalletInitArgs) => unlockWeb3(networks)
  } as WalletService,
  [WalletId.LEDGER_NANO_S_NEW]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => LedgerWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new LedgerWallet(address, dPath, index)
  } as HardwareWalletService,
  [WalletId.LEDGER_NANO_S]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => LedgerWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new LedgerWallet(address, dPath, index)
  } as HardwareWalletService,
  [WalletId.TREZOR_NEW]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => TrezorWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new TrezorWallet(address, dPath, index)
  } as HardwareWalletService,
  [WalletId.TREZOR]: {
    getChainCode: (dPath: string): Promise<ChainCodeResponse> => TrezorWallet.getChainCode(dPath),
    init: ({ address, dPath, index }: HardwareWalletInitArgs) =>
      new TrezorWallet(address, dPath, index)
  } as HardwareWalletService,
  [WalletId.VIEW_ONLY]: {
    init: ({ address }: ViewOnlyWalletInitArgs) => new AddressOnlyWallet(address)
  } as WalletService,
  [WalletId.WALLETCONNECT]: {
    init: ({ address, signMessageHandler }: WalletConnectWalletInitArgs) =>
      new WalletConnectWallet(address, signMessageHandler)
  } as WalletService
};
