import React from 'react';
import { Heading, Typography } from '@mycrypto/ui';

import sendIcon from 'common/assets/images/icn-send.svg';
import { Currency } from 'v2/components';
import { TSymbol } from 'v2/types';
import { translateRaw } from 'v2/translations';

interface Props {
  amount: string;
  ticker: TSymbol;
  fiatAsset: { ticker: TSymbol; exchangeRate: string };
}

function TransactionValueDisplay({ amount, ticker, fiatAsset }: Props) {
  // @TODO handle math with BN.js
  const convertToFiat = (base: string, rate: string) => {
    return (parseFloat(base) * parseFloat(rate)).toString();
  };

  const txAmountinFiat = convertToFiat(amount, fiatAsset.exchangeRate);

  return (
    <div className="SendAssetsForm-fieldset-youllSend-box">
      <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
        <img src={sendIcon} alt="Send" />
        <Currency amount={amount} symbol={ticker} />
      </Heading>
      <small className="SendAssetsForm-fieldset-youllSend-box-fiat">
        {'≈ '}
        <Currency amount={txAmountinFiat} symbol={fiatAsset.ticker} decimals={2} />
      </small>
      <div className="SendAssetsForm-fieldset-youllSend-box-conversion">
        <Typography as="div">
          {translateRaw('CONVERSION_RATE')}
          <br />
          <Currency amount={'1'} symbol={ticker} decimals={0} />
          {' ≈ '}
          <Currency amount={fiatAsset.exchangeRate} symbol={fiatAsset.ticker} decimals={2} />
        </Typography>
      </div>
    </div>
  );
}

export default TransactionValueDisplay;
