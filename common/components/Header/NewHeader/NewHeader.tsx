import React from 'react';
import { Link } from 'react-router-dom';

import logo from 'assets/images/logo-mycrypto.svg';
import './NewHeader.scss';

const LINKSET = {
  SEND_AND_RECEIVE: [
    {
      to: '/account',
      title: 'Send Ether & Tokens'
    },
    {
      to: '/account/request',
      title: 'Request Payment'
    },
    {
      to: '/account/info',
      title: 'Wallet Info'
    },
    {
      to: '/account/recent-txs',
      title: 'View Recent Transactions'
    },
    {
      to: '/account/address-book',
      title: 'Address Book'
    }
  ],
  BUY_AND_EXCHANGE: [
    {
      to: '/swap',
      title: 'Swap ETH & Tokens'
    }
  ],
  TOOLS: [
    {
      to: '/sign-and-verify-message',
      title: 'Sign & Verify Message'
    },
    {
      to: '/contracts',
      title: 'Interact with Contracts'
    },
    {
      to: '/tx-status',
      title: 'Check Transaction Status'
    },
    {
      to: '/pushTx',
      title: 'Broadcast Transaction'
    },
    {
      to: '/ens',
      title: 'ENS Domains'
    }
  ]
};

class NewHeader extends React.Component {
  render() {
    return (
      <section className="NewHeader">
        <section className="NewHeader-top">
          <section className="NewHeader-top-left">
            <ul className="NewHeader-top-links">
              <li>Help & Support</li>
              <li>Latest News</li>
            </ul>
          </section>
          <section className="NewHeader-top-center">
            <img src={logo} alt="Our logo" />
          </section>
          <section className="NewHeader-top-right">
            <ul className="NewHeader-top-links">
              <li>English</li>
              <li>Ethereum (Auto)</li>
            </ul>
          </section>
        </section>
        <section className="NewHeader-bottom">
          <ul className="NewHeader-bottom-links">
            <li className="NewHeader-bottom-links-item">
              Send & Receive
              <ul className="NewHeader-bottom-links-dropdown">
                {LINKSET.SEND_AND_RECEIVE.map(item => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="NewHeader-bottom-links-item">
              Buy & Exchange
              <ul className="NewHeader-bottom-links-dropdown">
                {LINKSET.BUY_AND_EXCHANGE.map(item => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="NewHeader-bottom-links-item">
              Tools
              <ul className="NewHeader-bottom-links-dropdown">
                {LINKSET.TOOLS.map(item => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="NewHeader-bottom-links-item">Create Wallet</li>
          </ul>
        </section>
      </section>
    );
  }
}

export default NewHeader;
