import React, { useContext } from 'react';
import { Heading, Typography } from '@mycrypto/ui';

import sendIcon from '@assets/images/icn-send.svg';
import { Currency } from '@components';
import { TTicker } from '@types';
import { translateRaw } from '@translations';
import { SettingsContext } from '@services';
import { getFiat } from '@config/fiats';

interface Props {
  amount: string;
  ticker: TTicker;
  fiatAsset: { ticker: TTicker; exchangeRate: string };
}

function TransactionValueDisplay({ amount, ticker, fiatAsset }: Props) {
  const { settings } = useContext(SettingsContext);
  // @todo handle math with BN.js
  const convertToFiat = (base: string, rate: string) => {
    return (parseFloat(base) * parseFloat(rate)).toString();
  };

  const txAmountinFiat = convertToFiat(amount, fiatAsset.exchangeRate);

  return (
    <div className="SendAssetsForm-fieldset-youllSend-box">
      <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
        <img src={sendIcon} alt="Send" />
        <Currency amount={amount} ticker={ticker} />
      </Heading>
      <small className="SendAssetsForm-fieldset-youllSend-box-fiat">
        {'≈ '}
        <Currency amount={txAmountinFiat} ticker={fiatAsset.ticker} decimals={2} />
      </small>
      <div className="SendAssetsForm-fieldset-youllSend-box-conversion">
        <Typography as="div">
          {translateRaw('CONVERSION_RATE')}
          <br />
          <Currency amount={'1'} ticker={ticker} decimals={0} />
          {' ≈ '}
          <Currency
            amount={fiatAsset.exchangeRate}
            ticker={fiatAsset.ticker}
            code={getFiat(settings).code}
            decimals={2}
          />
        </Typography>
      </div>
    </div>
  );
}

export default TransactionValueDisplay;
