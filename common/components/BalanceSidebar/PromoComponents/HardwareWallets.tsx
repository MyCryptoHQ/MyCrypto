import React from 'react';
import { knowledgeBaseURL } from 'config/data';
import ledgerLogo from 'assets/images/logo-ledger.svg';
import trezorLogo from 'assets/images/logo-trezor.svg';

export const HardwareWallets: React.SFC = () => (
  <a
    className="Promos-promo Promos-HardwareWallets"
    target="_blank"
    rel="noopener noreferrer"
    href={`${knowledgeBaseURL}/security/securing-your-ethereum`}
  >
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <h6>Learn more about protecting your funds.</h6>
      </div>
      <div className="Promos-promo-images">
        <img src={ledgerLogo} />
        <img src={trezorLogo} />
      </div>
    </div>
  </a>
);
