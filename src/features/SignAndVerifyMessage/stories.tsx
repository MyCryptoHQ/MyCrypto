import { HWLegacy, WalletConnectDecrypt, Web3ProviderDecrypt } from '@components';
import { withWalletConnect } from '@services/WalletService';
import { IStory, WalletId } from '@types';

export const getStories = (): IStory[] => [
  {
    name: WalletId.WEB3,
    steps: [Web3ProviderDecrypt]
  },
  {
    name: WalletId.LEDGER_NANO_S_NEW,
    steps: [HWLegacy]
  },
  {
    name: WalletId.TREZOR,
    steps: [HWLegacy]
  },
  {
    name: WalletId.GRIDPLUS,
    steps: [HWLegacy]
  },
  {
    name: WalletId.WALLETCONNECT,
    steps: [withWalletConnect(WalletConnectDecrypt, false)]
  }
];
