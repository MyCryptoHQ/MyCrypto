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
    url: 'https://buy.mycrypto.com/'
  },
  {
    name: 'Shapeshift',
    srcDesktop: shapeshiftDesktop,
    srcMobile: shapeshiftMobile,
    url: '/swap/shapeshift'
  },
  {
    name: 'Trezor',
    srcDesktop: trezorDesktop,
    srcMobile: trezorMobile,
    url: 'https://shop.trezor.io/?offer_id=10&aff_id=1735'
  },
  {
    name: 'Ledger',
    srcDesktop: ledgerDesktop,
    srcMobile: ledgerMobile,
    url: 'https://www.ledgerwallet.com/r/1985?path=/products/'
  }
];
