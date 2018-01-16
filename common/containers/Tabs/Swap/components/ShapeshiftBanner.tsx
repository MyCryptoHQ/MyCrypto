import React from 'react';
import './ShapeshiftBanner.scss';
import shapeshiftSvg from 'assets/images/logo-shapeshift.svg';

export default () => (
  <div className="ShapeshiftBanner">
    <p>
      <b style={{ paddingRight: '8px' }}>New: </b>Exchange coins & tokens
    </p>
    <img src={shapeshiftSvg} />
  </div>
);
