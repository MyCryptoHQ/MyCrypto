import { ITxFields } from '../../types';
import React from 'react';
import { Heading, Typography } from '@mycrypto/ui';
import sendIcon from 'common/assets/images/icn-send.svg';

interface Props {
  values: ITxFields;
  fiatAsset: { fiat: string; value: string; symbol: string };
}

function TransactionValueDisplay({ values, fiatAsset }: Props) {
  const amount = values.amount;
  const transactionValue = parseFloat(amount);
  let AssetSymbol: string = 'ETH';
  if (values.asset && values.asset.network) {
    AssetSymbol = values.asset.symbol;
  }

  const fiatValue: string = parseFloat(fiatAsset.value).toFixed(2);

  const transactionValueFiat: string = (transactionValue * parseFloat(fiatValue)).toFixed(2);

  return (
    <div className="SendAssetsForm-fieldset-youllSend-box">
      <Heading as="h2" className="SendAssetsForm-fieldset-youllSend-box-crypto">
        <img src={sendIcon} alt="Send" /> {transactionValue} {AssetSymbol}
      </Heading>
      <small className="SendAssetsForm-fieldset-youllSend-box-fiat">
        ≈ {fiatAsset.symbol}
        {transactionValueFiat} {fiatAsset.fiat}
      </small>
      <div className="SendAssetsForm-fieldset-youllSend-box-conversion">
        <Typography>
          Conversion Rate <br />
          {/* TRANSLATE THIS */}
          1 {AssetSymbol} ≈ {fiatAsset.symbol}
          {fiatValue} {fiatAsset.fiat}
        </Typography>
      </div>
    </div>
  );
}

export default TransactionValueDisplay;
