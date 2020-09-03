import {
  DesktopSignerUnlock,
  LedgerDecrypt,
  TrezorUnlock,
  ViewOnlyDecrypt,
  WalletConnectDecrypt,
  Web3ProviderDecrypt
} from '@components';
import { withWalletConnect } from '@services/WalletService';
import { IStory, WalletId } from '@types';
import { IS_PROD, IS_STAGING } from '@utils';

import { NetworkSelectPanel } from './components';

// This const is used to disable non supported wallets
export const IS_WEB_AND_PRODUCTION: boolean = IS_PROD && !IS_STAGING;

export const getStories = (): IStory[] => [
  {
    name: WalletId.WEB3,
    steps: [Web3ProviderDecrypt]
  },
  {
    name: WalletId.WALLETCONNECT,
    steps: [NetworkSelectPanel, withWalletConnect(WalletConnectDecrypt)]
  },
  {
    name: WalletId.LEDGER_NANO_S_NEW,
    steps: [NetworkSelectPanel, LedgerDecrypt]
  },
  {
    name: WalletId.TREZOR_NEW,
    steps: [NetworkSelectPanel, TrezorUnlock]
  },
  {
    name: WalletId.DESKTOP_SIGNER,
    steps: [NetworkSelectPanel, DesktopSignerUnlock]
  },
  {
    name: WalletId.VIEW_ONLY,
    steps: [NetworkSelectPanel, ViewOnlyDecrypt]
  }
];
