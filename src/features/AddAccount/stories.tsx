import {
  LedgerDecrypt,
  LedgerNanoSDecrypt,
  TrezorDecrypt,
  TrezorUnlock,
  ViewOnlyDecrypt,
  WalletConnectDecrypt,
  Web3ProviderDecrypt,
  Web3ProviderInstall
} from '@components';
import { withWalletConnect } from '@services/WalletService';
import { IStory, WalletId } from '@types';
import { hasWeb3Provider, IS_PROD, IS_STAGING } from '@utils';

import { NetworkSelectPanel } from './components';

// This const is used to disable non supported wallets
export const IS_WEB_AND_PRODUCTION: boolean = IS_PROD && !IS_STAGING;

export const getStories = (): IStory[] => [
  {
    name: WalletId.WEB3,
    steps: hasWeb3Provider() ? [Web3ProviderDecrypt] : [Web3ProviderInstall]
  },
  {
    name: WalletId.WALLETCONNECT,
    steps: [NetworkSelectPanel, withWalletConnect(WalletConnectDecrypt)]
  },
  {
    name: WalletId.LEDGER_NANO_S,
    steps: [NetworkSelectPanel, LedgerNanoSDecrypt],
    hideFromWalletList: true
  },
  {
    name: WalletId.LEDGER_NANO_S_NEW,
    steps: [NetworkSelectPanel, LedgerDecrypt]
  },
  {
    name: WalletId.TREZOR,
    steps: [NetworkSelectPanel, TrezorDecrypt],
    hideFromWalletList: true
  },
  {
    name: WalletId.TREZOR_NEW,
    steps: [NetworkSelectPanel, TrezorUnlock]
  },
  {
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt]
  }
];
