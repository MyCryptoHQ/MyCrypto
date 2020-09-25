import { translateRaw } from '@translations';
import { TURL } from '@types';

import SocialTelegramIcon from '../assets/images/social-icons/social-telegram-white.svg';
import { CRYPTOSCAMDB } from './data';

interface Link {
  link: string;
  text: string;
  icon?: string;
}

interface IExtUrl {
  url: TURL;
  name: string;
}

export const DOWNLOAD_MYCRYPTO_LINK = 'https://download.mycrypto.com';

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
    link: 'https://discord.gg/VSaTXEA',
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
    text: translateRaw('OLD_MYCRYPTO')
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    text: translateRaw('ETHER_ADDRESS_LOOKUP')
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/ethersecuritylookup/bhhfhgpgmifehjdghlbbijjaimhmcgnf',
    text: translateRaw('ETHER_SECURITY_LOOKUP')
  },
  {
    link: CRYPTOSCAMDB,
    text: translateRaw('CRYPTOSCAMDB')
  },
  {
    link: 'https://legacy.mycrypto.com/helpers.html',
    text: translateRaw('FOOTER_HELP_AND_DEBUGGING')
  },
  {
    link: 'https://hackerone.com/mycrypto',
    text: translateRaw('FOOTER_HACKERONE')
  }
];

const affiliateLinks: IExtUrl[] = [
  {
    name: 'LEDGER_REFERRAL',
    url: 'https://www.ledgerwallet.com/r/1985?path=/products/' as TURL
  },
  {
    name: 'TREZOR_REFERRAL',
    url: 'https://shop.trezor.io/?offer_id=10&aff_id=1735' as TURL
  },
  {
    name: 'QUIKNODE_REFERRAL',
    url: 'https://quiknode.io?tap_a=67226-09396e&tap_s=860550-6c3251' as TURL
  },
  {
    name: 'UNSTOPPABLEDOMAINS_REFERRAL',
    url: 'https://unstoppabledomains.com/r/mycrypto' as TURL
  },
  {
    name: 'COINBASE_REFERRAL',
    url: 'https://coinbase-consumer.sjv.io/RVmkN' as TURL
  }
];

export const partnerLinks: Link[] = [
  {
    link: 'https://metamask.io/',
    text: 'MetaMask'
  },
  {
    link: 'https://infura.io/',
    text: 'Infura'
  },
  {
    link: 'https://etherscan.io/',
    text: 'Etherscan'
  },
  {
    link: 'https://etherchain.org/',
    text: 'Etherchain'
  }
];

export const UNISWAP_LINK = 'https://app.uniswap.org/';

function createNavLinksFromExternalLinks(links: IExtUrl[]) {
  return links.reduce((acc, link) => {
    acc[link.name] = link;
    return acc;
  }, {} as Record<string, IExtUrl>);
}

export const EXT_URLS = createNavLinksFromExternalLinks(affiliateLinks);
