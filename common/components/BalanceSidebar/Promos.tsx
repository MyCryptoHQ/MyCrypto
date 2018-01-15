import React from 'react';
import { Link } from 'react-router-dom';
import { knowledgeBaseURL } from 'config/data';
import './Promos.scss';

const promos = [
  {
    isExternal: true,
    color: '#6e9a3e',
    href: `${knowledgeBaseURL}/security/securing-your-ethereum`,

    texts: [<h6 key="1">Learn more about protecting your funds.</h6>],
    images: [require('assets/images/logo-ledger.svg'), require('assets/images/logo-trezor.svg')]
  },
  {
    isExternal: true,
    color: '#2b71b1',
    href:
      'https://buy.coinbase.com?code=a6e1bd98-6464-5552-84dd-b27f0388ac7d&address=0xA7DeFf12461661212734dB35AdE9aE7d987D648c&crypto_currency=ETH&currency=USD',
    texts: [<p key="1">It’s now easier to get more ETH</p>, <h5 key="2">Buy ETH with USD</h5>],
    images: [require('assets/images/logo-coinbase.svg')]
  },
  {
    isExternal: false,
    color: '#006e79',
    href: '/swap',
    texts: [
      <p key="1">It’s now easier to get more ETH</p>,
      <h5 key="2">Swap BTC &lt;-&gt; ETH</h5>
    ],
    images: [require('assets/images/logo-bity-white.svg')]
  }
];

interface State {
  activePromo: number;
}

export default class Promos extends React.Component<{}, State> {
  public state = {
    activePromo: parseInt(String(Math.random() * promos.length), 10)
  };

  public render() {
    const { activePromo } = this.state;
    const promo = promos[activePromo];

    const promoContent = (
      <div className="Promos-promo-inner">
        <div className="Promos-promo-text">{promo.texts}</div>
        <div className="Promos-promo-images">
          {promo.images.map((img, idx) => <img src={img} key={idx} />)}
        </div>
      </div>
    );
    const promoEl = promo.isExternal ? (
      <a
        className="Promos-promo"
        key={promo.href}
        target="_blank"
        rel="noopener noreferrer"
        href={promo.href}
        style={{ backgroundColor: promo.color }}
      >
        {promoContent}
      </a>
    ) : (
      <Link
        className="Promos-promo"
        key={promo.href}
        to={promo.href}
        style={{ backgroundColor: promo.color }}
      >
        <div className="Promos-promo-inner">{promoContent}</div>
      </Link>
    );

    return (
      <div className="Promos">
        {promoEl}
        <div className="Promos-nav">
          {promos.map((_, index) => {
            return (
              <button
                className={`Promos-nav-btn ${index === activePromo ? 'is-active' : ''}`}
                key={index}
                onClick={this.navigateToPromo(index)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private navigateToPromo = (idx: number) => () => {
    this.setState({ activePromo: Math.max(0, Math.min(promos.length, idx)) });
  };
}
