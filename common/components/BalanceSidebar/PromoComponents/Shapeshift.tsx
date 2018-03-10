import React from 'react';
import { Link } from 'react-router-dom';
import ShapeshiftLogo from 'assets/images/logo-shapeshift.svg';

export const Shapeshift: React.SFC = () => (
  <Link className="Promos-promo Promos--shapeshift" to="/swap">
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <h5>
          Exchange Coins
          <br />
          & Tokens with
        </h5>
      </div>
      <div className="Promos-promo-images">
        <img src={ShapeshiftLogo} alt="Shapeshift Logo" />
      </div>
    </div>
  </Link>
);
