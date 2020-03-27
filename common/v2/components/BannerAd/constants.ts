import { EXT_URLS } from 'v2/config';
import ledgerDesktop from 'assets/images/banners/Ledger_Desktop.png';
import ledgerMobile from 'assets/images/banners/Ledger_Mobile.png';
import trezorDesktop from 'assets/images/banners/Trezor_Desktop.png';
import trezorMobile from 'assets/images/banners/Trezor_Mobile.png';

export const ads = [
  {
    name: 'Trezor',
    srcDesktop: trezorDesktop,
    srcMobile: trezorMobile,
    url: EXT_URLS.TREZOR_REFERRAL.path
  },
  {
    name: 'Ledger',
    srcDesktop: ledgerDesktop,
    srcMobile: ledgerMobile,
    url: EXT_URLS.LEDGER_REFERRAL.path
  }
];
