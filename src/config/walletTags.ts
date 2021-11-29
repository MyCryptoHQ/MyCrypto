import { WalletTags } from '@mycrypto/wallet-list';

import { TIcon } from '@components';
import { translateRaw } from '@translations';

export const getWalletTag = (tag: WalletTags): { icon: TIcon; text: string } => {
  switch (tag) {
    case WalletTags.Hardware:
      return {
        icon: 'hardware-tag',
        text: translateRaw('WALLET_TAG_HARDWARE')
      };
    case WalletTags.Web:
      return {
        icon: 'web-tag',
        text: translateRaw('WALLET_TAG_WEB')
      };
    case WalletTags.Mobile:
      return {
        icon: 'mobile-tag',
        text: translateRaw('WALLET_TAG_MOBILE')
      };
    case WalletTags.Desktop:
      return {
        icon: 'desktop-tag',
        text: translateRaw('WALLET_TAG_DESKTOP')
      };
    case WalletTags.Exchange:
      return {
        icon: 'exchange-tag',
        text: translateRaw('WALLET_TAG_EXCHANGE')
      };
    case WalletTags.WalletConnect:
      return {
        icon: 'walletconnect-tag',
        text: translateRaw('WALLET_TAG_WALLET_CONNECT')
      };
    case WalletTags.Other:
      return {
        icon: 'other-tag',
        text: translateRaw('WALLET_TAG_OTHER')
      };
  }
};
