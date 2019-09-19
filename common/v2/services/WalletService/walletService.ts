import { TAddress, WalletId, WalletService } from 'v2/types';
import {
  // EncryptedPrivateKeyWallet,
  // PresaleWallet,
  // MewV1Wallet,
  // PrivKeyWallet,
  // UtcWallet,
  // Web3Wallet,
  AddressOnlyWallet,
  ParitySignerWallet,
  // getUtcWallet,
  getPrivKeyWallet,
  getKeystoreWallet
} from './non-deterministic';
import {
  LedgerWallet,
  TrezorWallet,
  SafeTWallet,
  MnemonicWallet,
  // HardwareWallet
  ChainCodeResponse
} from './deterministic';
import { unlockWeb3 } from './web3';

export const WalletFactory = (walletId: WalletId): WalletService | any => {
  switch (walletId) {
    case WalletId.METAMASK:
      return unlockWeb3;
    case WalletId.LEDGER_NANO_S:
      return {
        getChainCode: (dPath: string): Promise<ChainCodeResponse> =>
          LedgerWallet.getChainCode(dPath),
        init: (address: TAddress, dPath: string, index: number) =>
          new LedgerWallet(address, dPath, index)
      };
    case WalletId.TREZOR:
      return TrezorWallet;
    case WalletId.SAFE_T_MINI:
      return SafeTWallet;
    case WalletId.PARITY_SIGNER:
      return ParitySignerWallet;
    case WalletId.KEYSTORE_FILE:
      return getKeystoreWallet;
    case WalletId.PRIVATE_KEY:
      return getPrivKeyWallet;
    case WalletId.MNEMONIC_PHRASE:
      return MnemonicWallet;
    case WalletId.VIEW_ONLY:
      return AddressOnlyWallet;
    default:
      throw new Error('[WalletService]: Unknown WalletId');
  }
};
