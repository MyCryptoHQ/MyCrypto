import React from 'react';

import { ANALYTICS_CATEGORIES } from '@services';
import { CRYPTOSCAMDB, getKBHelpArticle, KB_HELP_ARTICLE, EXT_URLS } from '@config';
import { translateRaw } from '@translations';
import './Linkset.scss';
import useAnalytics from '@utils/useAnalytics';

const LINK_COLUMNS = [
  {
    heading: translateRaw('NEW_FOOTER_TEXT_6'),
    links: [
      {
        title: 'MyCrypto.com',
        link: 'https://www.mycrypto.com/',
        analytics_event: 'MyCrypto.com'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_7'),
        link: getKBHelpArticle(KB_HELP_ARTICLE.HOME),
        analytics_event: 'Help & Support'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_8'),
        link: 'https://about.mycrypto.com/',
        analytics_event: 'Our Team'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_9'),
        link: 'mailto://press@mycrypto.com',
        analytics_event: 'Press'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_10'),
        link: 'https://about.mycrypto.com/privacy/',
        analytics_event: 'Privacy Policy'
      }
    ]
  },
  {
    heading: translateRaw('NEW_FOOTER_TEXT_11'),
    links: [
      {
        title: 'Get a Ledger',
        link: EXT_URLS.LEDGER_REFERRAL.url,
        analytics_event: 'Ledger Wallet'
      },
      {
        title: 'Get a Trezor',
        link: EXT_URLS.TREZOR_REFERRAL.url,
        analytics_event: 'TREZOR'
      },
      {
        title: 'Get Quiknode',
        link: EXT_URLS.QUIKNODE_REFERRAL.url,
        analytics_event: 'Quiknode'
      },
      {
        title: 'Buy ETH on Coinbase',
        link: EXT_URLS.COINBASE_REFERRAL.url,
        analytics_event: 'Coinbase'
      },
      {
        title: 'Unstoppable Domains',
        link: EXT_URLS.UNSTOPPABLEDOMAINS_REFERRAL.url,
        analytics_event: 'UnstoppableDomains'
      }
    ]
  },
  {
    heading: translateRaw('NEW_FOOTER_TEXT_12'),
    links: [
      {
        title: 'EtherAddressLookup',
        link:
          'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
        analytics_event: 'EtherAddressLookup'
      },
      {
        title: 'CryptoScamDB',
        link: CRYPTOSCAMDB,
        analytics_event: 'CryptoScamDB'
      },
      {
        title: 'MoneroVision',
        link: 'https://monerovision.com/',
        analytics_event: 'MoneroVision'
      },
      {
        title: 'FindETH',
        link: 'https://findeth.io',
        analytics_event: 'FindETH'
      }
    ]
  }
];

export default function Linkset() {
  const trackLinkClicked = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });

  return (
    <section className="Footer-Linkset">
      {LINK_COLUMNS.map(({ heading, links }) => (
        <section key={heading} className="Linkset-column">
          <h2>{heading}</h2>
          <ul>
            {links.map(({ title, link, analytics_event }) => (
              <li key={title}>
                <a
                  href={link}
                  onClick={() =>
                    trackLinkClicked({ actionName: `${analytics_event} link clicked` })
                  }
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
