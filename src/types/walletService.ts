import { DerivationPath } from '@mycrypto/wallets';

import { IUseWalletConnect } from '@services';
import { Network, TAddress } from '@types';

export interface WalletService {
  init(initArgs: WalletServiceInitArgs): any;
}

export type HardwareWalletService = WalletService;

type WalletServiceInitArgs =
  | Web3WalletInitArgs
  | HardwareWalletInitArgs
  | ViewOnlyWalletInitArgs
  | WalletConnectWalletInitArgs;

export interface Web3WalletInitArgs {
  networks: Network[];
}

export interface HardwareWalletInitArgs {
  address: TAddress;
  dPath: DerivationPath;
  index: number;
}

export interface ViewOnlyWalletInitArgs {
  address: TAddress;
}

export interface WalletConnectWalletInitArgs {
  address: TAddress;
  signMessageHandler: IUseWalletConnect['signMessage'];
  killHandler: IUseWalletConnect['kill'];
}
