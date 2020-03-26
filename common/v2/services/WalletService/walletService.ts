import { TAddress, WalletId, WalletService, Network } from 'v2/types';
import {
  // EncryptedPrivateKeyWallet,
  // PresaleWallet,
  // MewV1Wallet,
  // PrivKeyWallet,
  // UtcWallet,
  // Web3Wallet,
  AddressOnlyWallet,
  ParitySignerWallet
  // getUtcWallet,
  // getPrivKeyWallet
  // getKeystoreWallet
} from './non-deterministic';
import {
  LedgerWallet,
  TrezorWallet,
  SafeTWallet,
  // HardwareWallet
  ChainCodeResponse
} from './deterministic';
import { unlockKeystore, KeystoreUnlockParams } from './keystore';
import { unlockMnemonic, MnemonicUnlockParams } from './mnemonic';
import { unlockPrivateKey, PrivateKeyUnlockParams } from './privatekey';
import { unlockWeb3 } from './web3';
import { WalletConnectWallet, IUseWalletConnect } from './walletconnect';

export const WalletFactory = (walletId: WalletId): WalletService | any => {
  switch (walletId) {
    case WalletId.WEB3:
    case WalletId.TRUST:
      return {
        init: (networks: Network[], onSuccess: (args: any) => any) => {
          return unlockWeb3(onSuccess)(networks);
        }
      };
    case WalletId.LEDGER_NANO_S:
      return {
        getChainCode: (dPath: string): Promise<ChainCodeResponse> =>
          LedgerWallet.getChainCode(dPath),
        init: (address: TAddress, dPath: string, index: number) =>
          new LedgerWallet(address, dPath, index)
      };
    case WalletId.TREZOR:
      return {
        getChainCode: (dPath: string): Promise<ChainCodeResponse> =>
          TrezorWallet.getChainCode(dPath),
        init: (address: TAddress, dPath: string, index: number) =>
          new TrezorWallet(address, dPath, index)
      };
    case WalletId.SAFE_T_MINI:
      return {
        getChainCode: (dPath: string): Promise<ChainCodeResponse> =>
          SafeTWallet.getChainCode(dPath),
        init: (address: TAddress, dPath: string, index: number) =>
          new SafeTWallet(address, dPath, index)
      };
    case WalletId.PARITY_SIGNER:
      return {
        init: (address: TAddress) => new ParitySignerWallet(address)
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
