import {
  LedgerNanoSDecrypt,
  TrezorDecrypt,
  WalletConnectDecrypt,
  Web3ProviderDecrypt
} from '@components';
import { IStory, WalletId } from '@types';

export const getStories = (): IStory[] => [
  {
    name: WalletId.METAMASK,
    steps: [Web3ProviderDecrypt]
  },
  {
    name: WalletId.LEDGER_NANO_S_NEW,
    steps: [LedgerNanoSDecrypt]
  },
  {
    name: WalletId.TREZOR,
    steps: [TrezorDecrypt]
  },
  {
    name: WalletId.WALLETCONNECT,
    steps: [WalletConnectDecrypt]
  }
];
