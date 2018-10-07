import React from 'react';

import logo from 'assets/images/logo-mycrypto.svg';
import './NewHeader.scss';

class NewHeader extends React.Component {
  render() {
    return (
      <section className="NewHeader">
        <section className="NewHeader-top">
          <section className="NewHeader-top-left">
            <ul>
              <li>Help & Support</li>
              <li>Latest News</li>
            </ul>
          </section>
          <section className="NewHeader-top-center">
            <img src={logo} alt="Our logo" />
          </section>
          <section className="NewHeader-top-right">
            <ul>
              <li>English</li>
              <li>Ethereum (Auto)</li>
            </ul>
          </section>
        </section>
        <section className="NewHeader-bottom">
          <section className="NewHeader-bottom-links">
            <ul>
              <li>Send & Receive</li>
              <li>Buy & Exchange</li>
              <li>Tools</li>
              <li>Create Wallet</li>
            </ul>
          </section>
        </section>
      </section>
    );
  }
}

export default NewHeader;
