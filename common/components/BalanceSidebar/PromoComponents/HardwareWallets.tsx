import React from 'react';
import { HELP_ARTICLE } from 'config';
import { HelpLink } from 'components/ui';
import ledgerLogo from 'assets/images/logo-ledger.svg';
import trezorLogo from 'assets/images/logo-trezor.svg';
import translate from 'translations';

export const HardwareWallets: React.SFC = () => (
  <HelpLink className="Promos-promo Promos--hardware" article={HELP_ARTICLE.PROTECT_YOUR_FUNDS}>
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <h6>{translate('HARDWARE_PROMO')}</h6>
      </div>
      <div className="Promos-promo-images">
        <img src={ledgerLogo} alt="Ledger Logo" />
        <img src={trezorLogo} alt="Trezor Logo" />
      </div>
    </div>
  </HelpLink>
);
