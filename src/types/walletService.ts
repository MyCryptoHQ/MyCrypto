import { IUseWalletConnect } from '@services';
import { Network, TAddress } from '@types';

export interface WalletService {
  init(initArgs: WalletServiceInitArgs, cb?: (cbArgs: any) => any): any;
}

export interface HardwareWalletService extends WalletService {
  getChainCode(dPath: string): Promise<any>;
}

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
  dPath: string;
  index: number;
}

export interface ViewOnlyWalletInitArgs {
  address: TAddress;
}

export interface WalletConnectWalletInitArgs {
  address: TAddress;
  signMessageHandler: IUseWalletConnect['signMessage'];
}
