import BN from 'bn.js';
import React from 'react';
import { getBaseAssetSymbolByNetwork } from 'v2/libs/networks/networks';
import { fromWei, gasPriceToBase } from 'v2/libs/units';

interface Props {
  gasLimitToUse: string;
  gasPriceToUse: string;
  network: object;
  fiatAsset: { fiat: string; value: string; symbol: string };
}

function TransactionFeeDisplay({ gasLimitToUse, gasPriceToUse, network, fiatAsset }: Props) {
  const transactionFeeWei: BN = gasPriceToBase(
    parseFloat(gasPriceToUse) * parseFloat(gasLimitToUse)
  );
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(4);
  let baseAssetSymbol: string | undefined;
  if (network) {
    baseAssetSymbol = getBaseAssetSymbolByNetwork(network);
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
