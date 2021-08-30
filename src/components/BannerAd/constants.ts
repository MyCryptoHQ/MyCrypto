import coinbaseDesktop from '@assets/images/banners/Coinbase_Desktop.svg';
import coinbaseMobile from '@assets/images/banners/Coinbase_Mobile.svg';
import ledgerDesktop from '@assets/images/banners/Ledger_Desktop.svg';
import ledgerMobile from '@assets/images/banners/Ledger_Mobile.svg';
import PooltogetherDesktop from '@assets/images/banners/Pooltogether_Desktop.svg';
import PooltogetherMobile from '@assets/images/banners/Pooltogether_Mobile.svg';
import quicknodeDesktop from '@assets/images/banners/QuickNode_Desktop.svg';
import quicknodeMobile from '@assets/images/banners/QuickNode_Mobile.svg';
import SwapDesktop from '@assets/images/banners/Swap_Desktop.svg';
import SwapMobile from '@assets/images/banners/Swap_Mobile.svg';
import trezorDesktop from '@assets/images/banners/Trezor_Desktop.svg';
import trezorMobile from '@assets/images/banners/Trezor_Mobile.svg';
import unstoppableDesktop from '@assets/images/banners/UnstoppableDomains_Desktop.svg';
import unstoppableMobile from '@assets/images/banners/UnstoppableDomains_Mobile.svg';
import { EXT_URLS } from '@config';

export const ads = [
  {
    name: 'Trezor',
    srcDesktop: trezorDesktop,
    srcMobile: trezorMobile,
    url: EXT_URLS.TREZOR_REFERRAL.url
  },
  {
    name: 'Ledger',
    srcDesktop: ledgerDesktop,
    srcMobile: ledgerMobile,
    url: EXT_URLS.LEDGER_REFERRAL.url
  },
  {
    name: 'Coinbase',
    srcDesktop: coinbaseDesktop,
    srcMobile: coinbaseMobile,
    url: EXT_URLS.COINBASE_REFERRAL.url
  },
  {
    name: 'Quicknode',
    srcDesktop: quicknodeDesktop,
    srcMobile: quicknodeMobile,
    url: EXT_URLS.QUICKNODE_REFERRAL.url
  },
  {
    name: 'UnstoppableDomains',
    srcDesktop: unstoppableDesktop,
    srcMobile: unstoppableMobile,
    url: EXT_URLS.UNSTOPPABLEDOMAINS_REFERRAL.url
  },
  {
    name: 'PoolTogether',
    srcDesktop: PooltogetherDesktop,
    srcMobile: PooltogetherMobile,
    url: EXT_URLS.POOLTOGETHER_REFERRAL.url
  },
  {
    name: 'Swap',
    srcDesktop: SwapDesktop,
    srcMobile: SwapMobile,
    url: EXT_URLS.SWAP_REFERRAL.url
  }
];
