import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

import { donationAddressMap } from 'config';
import './DonateAndSubscribe.scss';

function DonationButton({ title, ...rest }) {
  return (
    <button className="DonationButton" {...rest}>
      {title}
    </button>
  );
}

class Donate extends Component {
  state = {
    displayingMessage: false
  };

  displayMessage = () =>
    this.setState(
      {
        displayingMessage: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              displayingMessage: false
            }),
          3000
        )
    );

  render() {
    const { displayingMessage } = this.state;
    const messageClassName = classnames({
      'Donate-buttons-message': true,
      visible: displayingMessage
    });

    return (
      <section className="Donate">
        <h2>Donate</h2>
        <section className="Donate-buttons">
          <CopyToClipboard text={donationAddressMap.ETH} onCopy={this.displayMessage}>
            <DonationButton title="Ethereum" />
          </CopyToClipboard>
          <CopyToClipboard text={donationAddressMap.BTC} onCopy={this.displayMessage}>
            <DonationButton title="Bitcoin" />
          </CopyToClipboard>
          <p className={messageClassName}>
            <span className="check">✓</span>
            Address Copied to Clipboard!
          </p>
        </section>
      </section>
    );
  }
}

function Subscribe() {
  return (
    <section className="Subscribe">
      <h2>Subscribe to MyCrypto</h2>
      <p>Get updates from MyCrypto straight to your inbox!</p>
      <section className="Subscribe-input">
        <input type="email" placeholder="Email address" />
        <button>Get Updates</button>
      </section>
    </section>
  );
}

export default function DonateAndSubscribe() {
  return (
    <section className="DonateAndSubscribe">
      <Donate />
      <Subscribe />
    </section>
  );
}
