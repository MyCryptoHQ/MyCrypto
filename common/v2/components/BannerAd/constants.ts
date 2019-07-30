import { ROUTE_PATHS, EXT_URLS } from 'v2/config';

import simplexDesktop from 'assets/images/ads/Simplex_Desktop.png';
import simplexMobile from 'assets/images/ads/Simplex_Mobile.png';
import shapeshiftDesktop from 'assets/images/ads/Shapeshift_Desktop.png';
import shapeshiftMobile from 'assets/images/ads/ShapeShift_Mobile.png';
import ledgerDesktop from 'assets/images/ads/Ledger_Desktop.png';
import ledgerMobile from 'assets/images/ads/Ledger_Mobile.png';
import trezorDesktop from 'assets/images/ads/Trezor_Desktop.png';
import trezorMobile from 'assets/images/ads/Trezor_Mobile.png';

export const ads = [
  {
    name: 'Simplex',
    srcDesktop: simplexDesktop,
    srcMobile: simplexMobile,
    url: ROUTE_PATHS.BUY.path
  },
  {
    name: 'Shapeshift',
    srcDesktop: shapeshiftDesktop,
    srcMobile: shapeshiftMobile,
    url: ROUTE_PATHS.SWAP_SHAPESHIFT.path
  },
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
