import BN from 'bn.js';
import React from 'react';
import { getBaseAssetSymbolByNetwork } from 'v2/libs/networks/networks';
import { fromWei, gasPriceToBase } from 'v2/libs/units';
import { FormikFormState } from '../../types';

interface Props {
  values: FormikFormState;
  fiatAsset: { fiat: string; value: string; symbol: string };
}

function TransactionFeeDisplay({ values, fiatAsset }: Props) {
  const gasLimitToUse =
    values.formikState.isAdvancedTransaction && values.formikState.isGasLimitManual
      ? values.formikState.gasLimitField
      : values.formikState.gasLimitEstimated;
  const gasPriceToUse = values.formikState.isAdvancedTransaction
    ? values.formikState.gasPriceField
    : values.formikState.gasPriceSlider;
  const transactionFeeWei: BN = gasPriceToBase(
    parseFloat(gasPriceToUse) * parseFloat(gasLimitToUse)
  );
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(4);
  let baseAssetSymbol: string | undefined;
  if (values.sharedConfig.senderNetwork) {
    baseAssetSymbol = getBaseAssetSymbolByNetwork(values.sharedConfig.senderNetwork);
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
