import React from 'react';
import { Link } from 'react-router-dom';

import ShapeshiftLogo from 'assets/images/logo-shapeshift.svg';
import translate from 'translations';

export const Shapeshift: React.SFC = () => (
  <Link className="Promos-promo Promos--shapeshift" to="/swap">
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <h5>
          {translate('SHAPESHIFT_PROMO_1')}
          <br />
          {translate('SHAPESHIFT_PROMO_2')}
        </h5>
      </div>
      <div className="Promos-promo-images">
        <img src={ShapeshiftLogo} alt="Shapeshift Logo" />
      </div>
    </div>
  </Link>
);
