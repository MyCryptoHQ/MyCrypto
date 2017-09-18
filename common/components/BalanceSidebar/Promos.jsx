// @flow
import './Promos.scss';
import React from 'react';
import { Link } from 'react-router';

const promos = [
  {
    color: '#6e9a3e',
    href:
      'https://myetherwallet.groovehq.com/knowledge_base/topics/protecting-yourself-and-your-funds',
    isExternal: true,
    texts: [<h6 key="1">Learn more about protecting your funds.</h6>],
    images: [
      require('assets/images/logo-ledger.svg'),
      require('assets/images/logo-trezor.svg')
    ]
  },
  {
    color: '#2b71b1',
    href:
      'https://buy.coinbase.com?code=a6e1bd98-6464-5552-84dd-b27f0388ac7d&address=0xA7DeFf12461661212734dB35AdE9aE7d987D648c&crypto_currency=ETH&currency=USD',
    isExternal: true,
    texts: [
      <p key="1">It’s now easier to get more ETH</p>,
      <h5 key="2">Buy ETH with USD</h5>
    ],
    images: [require('assets/images/logo-coinbase.svg')]
  },
  {
    color: '#006e79',
    href: '/swap',
    texts: [
      <p key="1">It’s now easier to get more ETH</p>,
      <h5 key="2">Swap BTC &lt;-&gt; ETH</h5>
    ],
    images: [require('assets/images/logo-bity-white.svg')]
  }
];

export default class Promos extends React.Component {
  state: { activePromo: number };

  state = {
    activePromo: parseInt(Math.random() * promos.length)
  };

  _navigateToPromo = (idx: number) => {
    this.setState({ activePromo: Math.max(0, Math.min(promos.length, idx)) });
  };

  render() {
    const { activePromo } = this.state;
    const promo = promos[activePromo];

    const promoContent = (
      <div className="Promos-promo-inner">
        <div className="Promos-promo-text">
          {promo.texts}
        </div>
        <div className="Promos-promo-images">
          {promo.images.map((img, idx) => <img src={img} key={idx} />)}
        </div>
      </div>
    );
    const promoEl = promo.isExternal
      ? <a
          className="Promos-promo"
          key={promo.href}
          target="_blank"
          href={promo.href}
          style={{ backgroundColor: promo.color }}
        >
          {promoContent}
        </a>
      : <Link
          className="Promos-promo"
          key={promo.href}
          to={promo.href}
          style={{ backgroundColor: promo.color }}
        >
          <div className="Promos-promo-inner">
            {promoContent}
          </div>
        </Link>;

    return (
      <div className="Promos">
        {promoEl}
        <div className="Promos-nav">
          {promos.map((promo, idx) => {
            return (
              <button
                className={`Promos-nav-btn ${idx === activePromo
                  ? 'is-active'
                  : ''}`}
                key={idx}
                onClick={() => this._navigateToPromo(idx)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
