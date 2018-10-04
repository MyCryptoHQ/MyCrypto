import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

import { donationAddressMap } from 'config';
import translate from 'translations';
import ether from 'assets/images/ether.png';
import bitcoin from 'assets/images/bitcoin.png';
import './DonateAndSubscribe.scss';

interface DonationButtonProps {
  icon: string;
  title: string;
}

function DonationButton({ icon, title, ...rest }: DonationButtonProps) {
  return (
    <button className="DonationButton" {...rest}>
      <img src={icon} alt={`Icon for ${title}`} /> {title}
    </button>
  );
}

class Donate extends Component {
  public state = {
    displayingMessage: false
  };

  public render() {
    const { displayingMessage } = this.state;
    const messageClassName = classnames({
      'Donate-buttons-message': true,
      visible: displayingMessage
    });

    return (
      <section className="Donate">
        <h2>{translate('NEW_FOOTER_TEXT_1')}</h2>
        <section className="Donate-buttons">
          <CopyToClipboard text={donationAddressMap.ETH} onCopy={this.displayMessage}>
            <DonationButton icon={ether} title="Ethereum" />
          </CopyToClipboard>
          <CopyToClipboard text={donationAddressMap.BTC} onCopy={this.displayMessage}>
            <DonationButton icon={bitcoin} title="Bitcoin" />
          </CopyToClipboard>
        </section>
        <p className={messageClassName}>
          <span className="check">✓</span>
          {translate('NEW_FOOTER_TEXT_2')}
        </p>
      </section>
    );
  }

  private displayMessage = () =>
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
}

function Subscribe() {
  return (
    <section className="Subscribe">
      <h2>{translate('NEW_FOOTER_TEXT_3')}</h2>
      <p>{translate('NEW_FOOTER_TEXT_4')}</p>
      <section className="Subscribe-input-wrapper">
        <section className="Subscribe-input-wrapper-input">
          <input type="email" placeholder="Email address" />
        </section>
        <section className="Subscribe-input-wrapper-button">
          <button>{translate('NEW_FOOTER_TEXT_5')}</button>
        </section>
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
