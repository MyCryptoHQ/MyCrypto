import React from 'react';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { knowledgeBaseURL } from 'v2/config';
import { translateRaw } from 'translations';
import './Linkset.scss';

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
        link: knowledgeBaseURL,
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
        title: 'Ledger Wallet',
        link: 'https://www.ledgerwallet.com/r/1985?path=/products/',
        analytics_event: 'Ledger Wallet'
      },
      {
        title: 'TREZOR',
        link: 'https://shop.trezor.io/?offer_id=10&aff_id=1735',
        analytics_event: 'TREZOR'
      },
      {
        title: 'ether.card',
        link: 'https://ether.cards/?utm_source=mycrypto&utm_medium=cpm&utm_campaign=site',
        analytics_event: 'ether.card'
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
        title: 'EtherScamDB',
        link: 'https://etherscamdb.info/',
        analytics_event: 'EtherScamDB'
      },
      {
        title: 'MoneroVision',
        link: 'https://monerovision.com/',
        analytics_event: 'MoneroVision'
      }
    ]
  }
];

const trackLinkClicked = (linkName: string): void => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.FOOTER, `${linkName} link clicked`);
};

export default function Linkset() {
  return (
    <section className="Linkset">
      {LINK_COLUMNS.map(({ heading, links }) => (
        <section key={heading} className="Linkset-column">
          <h2>{heading}</h2>
          <ul>
            {links.map(({ title, link, analytics_event }) => (
              <li key={title}>
                <a href={link} onClick={() => trackLinkClicked(analytics_event)}>
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
