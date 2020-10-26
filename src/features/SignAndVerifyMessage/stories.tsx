import {
  LedgerNanoSDecrypt,
  TrezorDecrypt,
  WalletConnectDecrypt,
  Web3ProviderDecrypt,
  Web3ProviderInstall
} from '@components';
import { IStory, WalletId } from '@types';
import { hasWeb3Provider } from '@utils';

export const getStories = (): IStory[] => [
  {
    name: WalletId.METAMASK,
    steps: hasWeb3Provider() ? [Web3ProviderDecrypt] : [Web3ProviderInstall]
  },
  {
    name: WalletId.LEDGER_NANO_S,
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
