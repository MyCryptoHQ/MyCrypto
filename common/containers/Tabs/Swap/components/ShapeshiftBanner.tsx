import React from 'react';
import './ShapeshiftBanner.scss';
import shapeshiftSvg from 'assets/images/logo-shapeshift.svg';

const ShapeshiftBanner: React.SFC<{}> = () => (
  <div className="ShapeshiftBanner">
    <p>
      <b style={{ paddingRight: '8px' }}>New Feature: </b>Exchange coins & tokens
    </p>
    <img src={shapeshiftSvg} />
  </div>
);

export default ShapeshiftBanner;
