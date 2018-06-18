import React from 'react';

import CoinbaseLogo from 'assets/images/logo-coinbase.svg';
import { NewTabLink } from 'components/ui';
import translate from 'translations';

interface Props {
  address: string;
}

export const Coinbase: React.SFC<Props> = ({ address }) => (
  <NewTabLink
    className="Promos-promo Promos--coinbase"
    href={`https://buy.coinbase.com?code=60c05061-3a76-57be-b1cd-a7afa97bcb8c&address=${address}&crypto_currency=ETH&currency=USD`}
  >
    <div className="Promos-promo-inner">
      <div className="Promos-promo-text">
        <p key="1">{translate('COINBASE_PROMO_SMALL')}</p>
        <h5 key="2">{translate('COINBASE_PROMO')}</h5>
      </div>
      <div className="Promos-promo-images">
        <img src={CoinbaseLogo} alt="Coinbase logo" />
      </div>
    </div>
  </NewTabLink>
);
