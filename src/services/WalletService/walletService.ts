import { Network, TAddress, WalletId, WalletService } from '@types';

import { ChainCodeResponse, LedgerWallet, TrezorWallet } from './deterministic';
import { KeystoreUnlockParams, unlockKeystore } from './keystore';
import { MnemonicUnlockParams, unlockMnemonic } from './mnemonic';
import { AddressOnlyWallet } from './non-deterministic';
import { PrivateKeyUnlockParams, unlockPrivateKey } from './privatekey';
import { IUseWalletConnect, WalletConnectWallet } from './walletconnect';
import { unlockWeb3 } from './web3';

export const WalletFactory = (walletId: WalletId): WalletService | any => {
  switch (walletId) {
    case WalletId.WEB3:
    case WalletId.TRUST:
      return {
        init: (networks: Network[], onSuccess: (args: any) => any) => {
          return unlockWeb3(onSuccess)(networks);
        }
      };
    case WalletId.LEDGER_NANO_S_NEW:
    case WalletId.LEDGER_NANO_S:
      return {
        getChainCode: (dPath: string): Promise<ChainCodeResponse> =>
          LedgerWallet.getChainCode(dPath),
        init: (address: TAddress, dPath: string, index: number) =>
          new LedgerWallet(address, dPath, index)
      };
    case WalletId.TREZOR_NEW:
    case WalletId.TREZOR:
      return {
        getChainCode: (dPath: string): Promise<ChainCodeResponse> =>
          TrezorWallet.getChainCode(dPath),
        init: (address: TAddress, dPath: string, index: number) =>
          new TrezorWallet(address, dPath, index)
      };
    case WalletId.KEYSTORE_FILE:
      return {
        init: ({ file, password }: KeystoreUnlockParams) => unlockKeystore({ file, password })
      };
    case WalletId.PRIVATE_KEY:
      return {
        init: ({ key, password }: PrivateKeyUnlockParams) => unlockPrivateKey({ key, password })
      };
    case WalletId.MNEMONIC_PHRASE:
      return {
        init: ({ ...params }: MnemonicUnlockParams) => unlockMnemonic(params)
      };
    case WalletId.VIEW_ONLY:
      return {
        init: (address: TAddress) => new AddressOnlyWallet(address)
      };
    case WalletId.WALLETCONNECT:
      return {
        init: (address: TAddress, signMessageHandler: IUseWalletConnect['signMessage']) =>
          new WalletConnectWallet(address, signMessageHandler)
      };
    default:
      throw new Error('[WalletService]: Unknown WalletId');
  }
};
