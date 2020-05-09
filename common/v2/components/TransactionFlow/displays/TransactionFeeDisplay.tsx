import React from 'react';

import { Asset } from '@types';
import { gasStringsToMaxGasNumber } from '@services/EthService';

interface Props {
  baseAsset: Asset;
  gasLimitToUse: string;
  gasPriceToUse: string;
  fiatAsset: { fiat: string; rate: string; symbol: string };
}

function TransactionFeeDisplay({ baseAsset, gasLimitToUse, gasPriceToUse, fiatAsset }: Props) {
  const transactionFeeETH: number = gasStringsToMaxGasNumber(gasPriceToUse, gasLimitToUse);
  const baseAssetSymbol: string = baseAsset.ticker || 'ETH';

  const fiatValue: string = (parseFloat(fiatAsset.rate) * transactionFeeETH).toFixed(4);

  return (
    <React.Fragment>
      {transactionFeeETH.toFixed(4)} {baseAssetSymbol} / {fiatAsset.symbol}
      {fiatValue} {fiatAsset.fiat}
    </React.Fragment>
  );
}

export default TransactionFeeDisplay;
