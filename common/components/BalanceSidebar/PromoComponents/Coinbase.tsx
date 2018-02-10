import React from 'react';
import CoinbaseLogo from 'assets/images/logo-coinbase.svg';

export const Coinbase: React.SFC = () => (
  <a
    className="Promos-promo Promos-Coinbase"
    target="_blank"
    rel="noopener noreferrer"
    href="https://buy.coinbase.com?code=60c05061-3a76-57be-b1cd-a7afa97bcb8c&address=0xA7DeFf12461661212734dB35AdE9aE7d987D648c&crypto_currency=ETH&currency=USD"
  >
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <p key="1">It’s now easier to get more ETH</p>
        <h5 key="2">Buy ETH with USD</h5>
      </div>
      <div className="Promos-promo-images">
        <img src={CoinbaseLogo} />
      </div>
    </div>
  </a>
);
