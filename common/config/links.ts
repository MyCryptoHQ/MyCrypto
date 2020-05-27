import { translateRaw } from 'translations';
import {
  discordURL,
  ledgerReferralURL,
  trezorReferralURL,
  safeTReferralURL,
  ethercardReferralURL,
  keepkeyReferralURL,
  steelyReferralURL
} from './data';

import SocialTelegramIcon from '../assets/images/social-telegram-white.svg';

interface Link {
  link: string;
  text: string;
  icon: null | string;
}

export const DOWNLOAD_MYCRYPTO_LINK = 'https://download.mycrypto.com/';

export const socialMediaLinks: Link[] = [
  {
    link: 'https://twitter.com/mycrypto',
    text: 'twitter',
    icon: null
  },
  {
    link: 'https://www.facebook.com/mycryptoHQ/',
    text: 'facebook',
    icon: null
  },
  {
    link: 'https://medium.com/@mycrypto',
    text: 'medium',
    icon: null
  },
  {
    link: 'https://www.linkedin.com/company/mycrypto',
    text: 'linkedin',
    icon: null
  },
  {
    link: 'https://github.com/MyCryptoHQ',
    text: 'github',
    icon: null
  },
  {
    link: 'https://www.reddit.com/r/mycrypto/',
    text: 'reddit',
    icon: null
  },
  {
    link: discordURL,
    text: 'discord',
    icon: null
  },
  {
    link: 'https://t.me/mycryptohq',
    text: 'telegram',
    icon: SocialTelegramIcon
  }
];

export const productLinks: Link[] = [
  {
    link: 'https://legacy.mycrypto.com/',
    text: translateRaw('OLD_MYCRYPTO'),
    icon: null
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    text: translateRaw('ETHER_ADDRESS_LOOKUP'),
    icon: null
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/ethersecuritylookup/bhhfhgpgmifehjdghlbbijjaimhmcgnf',
    text: translateRaw('ETHER_SECURITY_LOOKUP'),
    icon: null
  },
  {
    link: 'https://cryptoscamdb.org/',
    text: translateRaw('CRYPTOSCAMDB'),
    icon: null
  },
  {
    link: 'https://legacy.mycrypto.com/helpers.html',
    text: translateRaw('FOOTER_HELP_AND_DEBUGGING'),
    icon: null
  },
  {
    link: 'https://security.mycrypto.com',
    text: translateRaw('FOOTER_SECURITY'),
    icon: null
  }
];

export const affiliateLinks: Link[] = [
  {
    link: ledgerReferralURL,
    text: translateRaw('LEDGER_REFERRAL_1'),
    icon: null
  },
  {
    link: trezorReferralURL,
    text: translateRaw('TREZOR_REFERAL'),
    icon: null
  },
  {
    link: safeTReferralURL,
    text: translateRaw('SAFE_T_REFERAL'),
    icon: null
  },
  {
    link: keepkeyReferralURL,
    text: translateRaw('KEEPKEY_REFERRAL'),
    icon: null
  },
  {
    link: steelyReferralURL,
    text: translateRaw('STEELY_REFERRAL'),
    icon: null
  },
  {
    link: ethercardReferralURL,
    text: translateRaw('ETHERCARD_REFERAL'),
    icon: null
  }
];

export const partnerLinks: Link[] = [
  {
    link: 'https://metamask.io/',
    text: 'MetaMask',
    icon: null
  },
  {
    link: 'https://infura.io/',
    text: 'Infura',
    icon: null
  },
  {
    link: 'https://etherscan.io/',
    text: 'Etherscan',
    icon: null
  },
  {
    link: 'https://etherchain.org/',
    text: 'Etherchain',
    icon: null
  }
];
