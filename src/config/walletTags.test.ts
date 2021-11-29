import { WalletTags } from '@mycrypto/wallet-list';

import { translateRaw } from '@translations';

import { getWalletTag } from './walletTags';

describe('getWalletTag()', () => {
  it('can return WalletTag config', () => {
    expect(getWalletTag(WalletTags.Hardware)).toEqual({
      icon: 'hardware-tag',
      text: translateRaw('WALLET_TAG_HARDWARE')
    });

    expect(getWalletTag(WalletTags.Web)).toEqual({
      icon: 'web-tag',
      text: translateRaw('WALLET_TAG_WEB')
    });

    expect(getWalletTag(WalletTags.Mobile)).toEqual({
      icon: 'mobile-tag',
      text: translateRaw('WALLET_TAG_MOBILE')
    });

    expect(getWalletTag(WalletTags.Desktop)).toEqual({
      icon: 'desktop-tag',
      text: translateRaw('WALLET_TAG_DESKTOP')
    });

    expect(getWalletTag(WalletTags.Exchange)).toEqual({
      icon: 'exchange-tag',
      text: translateRaw('WALLET_TAG_EXCHANGE')
    });

    expect(getWalletTag(WalletTags.WalletConnect)).toEqual({
      icon: 'walletconnect-tag',
      text: translateRaw('WALLET_TAG_WALLET_CONNECT')
    });

    expect(getWalletTag(WalletTags.Other)).toEqual({
      icon: 'other-tag',
      text: translateRaw('WALLET_TAG_OTHER')
    });
  });
});
