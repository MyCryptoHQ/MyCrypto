import { ITxFields } from '../../types';
import { getBaseAssetSymbolByNetwork } from 'v2/libs/networks/networks';
import React from 'react';
import { calculateStringTransactionFee } from 'v2/features/Gas/transactionFees';

interface Props {
  values: ITxFields;
  fiatAsset: { fiat: string; value: string; symbol: string };
}

function TransactionFeeDisplay({ values, fiatAsset }: Props) {
  const transactionFeeBaseAdv: string = calculateStringTransactionFee(values);
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(4);
  let baseAssetSymbol: string | undefined;
  if (values.network) {
    baseAssetSymbol = getBaseAssetSymbolByNetwork(values.network);
  }
  const baseAsset: string = !baseAssetSymbol ? 'Ether' : baseAssetSymbol;

  const fiatValue: string = (
    parseFloat(fiatAsset.value) * parseFloat(transactionFeeBaseAdv)
  ).toFixed(4);

  return (
    <React.Fragment>
      {transactionFeeBase} {baseAsset} / {fiatAsset.symbol}
      {fiatValue} {fiatAsset.fiat}
    </React.Fragment>
  );
}

export default TransactionFeeDisplay;
