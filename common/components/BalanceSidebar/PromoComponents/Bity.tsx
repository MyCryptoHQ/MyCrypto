import React from 'react';
import { Link } from 'react-router-dom';
import BityLogo from 'assets/images/logo-bity-white.svg';

export const Bity: React.SFC = () => (
  <Link className="Promos-promo Promos-Bity" target="_blank" rel="noopener noreferrer" to="/swap">
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <p>It’s now easier to get more ETH</p>
        <h5>Swap BTC &lt;-&gt; ETH</h5>
      </div>
      <div className="Promos-promo-images">
        <img src={BityLogo} />
      </div>
    </div>
  </Link>
);
