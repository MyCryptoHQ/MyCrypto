import React from 'react';
import MoneroVisionLogo from 'assets/images/logo-monerovision.svg';
import { NewTabLink } from 'components/ui';
import translate from 'translations';

export const MoneroVision: React.SFC = () => (
  <NewTabLink className="Promos-promo Promos--monerovision" href={`https://monerovision.com/`}>
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <h5 key="2">{translate('MONEROVISION_PROMO')}</h5>
      </div>
      <div className="Promos-promo-images">
        <img src={MoneroVisionLogo} alt="MoneroVision logo" />
      </div>
    </div>
  </NewTabLink>
);
