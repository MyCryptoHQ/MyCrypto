import React from 'react';

import { CRYPTOSCAMDB, EXT_URLS, getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { translateRaw } from '@translations';
import './Linkset.scss';

const LINK_COLUMNS = [
  {
    heading: translateRaw('NEW_FOOTER_TEXT_6'),
    links: [
      {
        title: 'MyCrypto.com',
        link: 'https://www.mycrypto.com/'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_7'),
        link: getKBHelpArticle(KB_HELP_ARTICLE.HOME)
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_8'),
        link: 'https://about.mycrypto.com/'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_9'),
        link: 'mailto:press@mycrypto.com'
      },
      {
        title: translateRaw('NEW_FOOTER_TEXT_10'),
        link: 'https://about.mycrypto.com/privacy/'
      }
    ]
  },
  {
    heading: translateRaw('NEW_FOOTER_TEXT_11'),
    links: [
      {
        title: 'Get a Ledger',
        link: EXT_URLS.LEDGER_REFERRAL.url
      },
      {
        title: 'Get a Trezor',
        link: EXT_URLS.TREZOR_REFERRAL.url
      },
      {
        title: 'Get Quiknode',
        link: EXT_URLS.QUIKNODE_REFERRAL.url
      },
      {
        title: 'Buy ETH on Coinbase',
        link: EXT_URLS.COINBASE_REFERRAL.url
      },
      {
        title: 'Unstoppable Domains',
        link: EXT_URLS.UNSTOPPABLEDOMAINS_REFERRAL.url
      }
    ]
  },
  {
    heading: translateRaw('NEW_FOOTER_TEXT_12'),
    links: [
      {
        title: 'EtherAddressLookup',
        link:
          'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn'
      },
      {
        title: 'CryptoScamDB',
        link: CRYPTOSCAMDB
      },
      {
        title: 'MoneroVision',
        link: 'https://monerovision.com/'
      },
      {
        title: 'FindETH',
        link: 'https://findeth.io'
      }
    ]
  }
];

export default function Linkset() {
  return (
    <section className="Footer-Linkset">
      {LINK_COLUMNS.map(({ heading, links }) => (
        <section key={heading} className="Linkset-column">
          <h2>{heading}</h2>
          <ul>
            {links.map(({ title, link }) => (
              <li key={title}>
                <a href={link}>{title}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
