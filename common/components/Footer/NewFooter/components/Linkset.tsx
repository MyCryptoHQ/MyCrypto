import React from 'react';

import './Linkset.scss';

const LINK_COLUMNS = [
  {
    heading: 'Company',
    links: [
      {
        title: 'MyCrypto.com',
        link: 'https://www.mycrypto.com/'
      },
      {
        title: 'Help & Support',
        link: 'https://support.mycrypto.com/'
      },
      {
        title: 'Our Team',
        link: 'https://about.mycrypto.com/'
      },
      {
        title: 'Press',
        link: 'mailto://press@mycrypto.com'
      },
      {
        title: 'Privacy Policy',
        link: 'https://about.mycrypto.com/privacy/'
      }
    ]
  },
  {
    heading: 'Support Us',
    links: [
      {
        title: 'Ledger Wallet',
        link: 'https://www.ledgerwallet.com/r/1985?path=/products/'
      },
      {
        title: 'TREZOR',
        link: 'https://shop.trezor.io/?a=mycrypto.com'
      },
      {
        title: 'ether.card',
        link: 'https://ether.cards/?utm_source=mycrypto&utm_medium=cpm&utm_campaign=site'
      }
    ]
  },
  {
    heading: 'Other Products',
    links: [
      {
        title: 'EtherAddressLookup',
        link:
          'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn'
      },
      {
        title: 'EtherScamDB',
        link: 'https://etherscamdb.info/'
      },
      {
        title: 'MoneroVision',
        link: 'https://monerovision.com/'
      }
    ]
  }
];

export default function Linkset() {
  return (
    <section className="Linkset">
      {LINK_COLUMNS.map(({ heading, links }) => (
        <section className="Linkset-column">
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
