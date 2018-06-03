import React from 'react';
import SimplexLogo from 'assets/images/logo-simplex.png';
import { NewTabLink } from 'components/ui';
import translate from 'translations';

export const Simplex: React.SFC = () => (
  <NewTabLink className="Promos-promo Promos--simplex" href={`https://buy.mycrypto.com/`}>
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <h5 key="2">{translate('SIMPLEX_PROMO')}</h5>
      </div>
      <div className="Promos-promo-images">
        <img src={SimplexLogo} alt="Simplex logo" />
      </div>
    </div>
  </NewTabLink>
);
