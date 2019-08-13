import React from 'react';
import BN from 'bn.js';

import { Asset } from 'v2/types';
import { gasPriceToBase, fromWei } from 'v2/services/EthService';

interface Props {
  baseAsset: Asset;
  gasLimitToUse: string;
  gasPriceToUse: string;
  fiatAsset: { fiat: string; value: string; symbol: string };
}

function TransactionFeeDisplay({ baseAsset, gasLimitToUse, gasPriceToUse, fiatAsset }: Props) {
  const transactionFeeWei: BN = gasPriceToBase(
    parseFloat(gasPriceToUse) * parseFloat(gasLimitToUse)
  );
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(4);
  const baseAssetSymbol: string = baseAsset.ticker || 'ETH';

  const fiatValue: string = (
    parseFloat(fiatAsset.value) * parseFloat(transactionFeeBaseAdv)
  ).toFixed(4);

  return (
    <React.Fragment>
      {transactionFeeBase} {baseAssetSymbol} / {fiatAsset.symbol}
      {fiatValue} {fiatAsset.fiat}
    </React.Fragment>
  );
}

export default TransactionFeeDisplay;
