import { translateRaw } from 'v2/translations';
import { CRYPTOSCAMDB } from './data';
import { TURL } from 'v2/types';

interface Link {
  link: string;
  text: string;
}

interface IExtUrl {
  url: TURL;
  name: string;
}

export const DOWNLOAD_MYCRYPTO_LINK = 'https://download.mycrypto.com';

export const socialMediaLinks: Link[] = [
  {
    link: 'https://twitter.com/mycrypto',
    text: 'twitter'
  },
  {
    link: 'https://www.facebook.com/mycryptoHQ/',
    text: 'facebook'
  },
  {
    link: 'https://medium.com/@mycrypto',
    text: 'medium'
  },
  {
    link: 'https://www.linkedin.com/company/mycrypto',
    text: 'linkedin'
  },
  {
    link: 'https://github.com/MyCryptoHQ',
    text: 'github'
  },
  {
    link: 'https://www.reddit.com/r/mycrypto/',
    text: 'reddit'
  },
  {
    link: 'https://discord.gg/VSaTXEA',
    text: 'discord'
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
    name: 'ETHER_CARD_REFERRAL',
    url: 'https://ether.cards/?utm_source=mycrypto&utm_medium=cpm&utm_campaign=site' as TURL
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

function createNavLinksFromExternalLinks(links: IExtUrl[]) {
  return links.reduce((acc, link) => {
    acc[link.name] = link;
    return acc;
  }, {} as Record<string, IExtUrl>);
}

export const EXT_URLS = createNavLinksFromExternalLinks(affiliateLinks);
