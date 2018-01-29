import React from 'react';
import './ShapeshiftBanner.scss';
import shapeshiftSvg from 'assets/images/logo-shapeshift.svg';

const ShapeshiftBanner: React.SFC<{}> = () => (
  <div className="ShapeshiftBanner">
    <div className="ShapeshiftBanner-banner">
      <p>
        <b className="ShapeshiftBanner-banner-new">New Feature:</b>
        Exchange coins & tokens with
      </p>
      <img src={shapeshiftSvg} />
    </div>
  </div>
);

export default ShapeshiftBanner;
