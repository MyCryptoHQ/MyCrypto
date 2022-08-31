import { Fragment } from 'react';

import { Asset } from '@types';
import { bigify, gasStringsToMaxGasNumber } from '@utils';

interface Props {
  baseAsset: Asset;
  gasLimitToUse: string;
  gasPriceToUse: string;
  fiatAsset: { fiat: string; rate: string; symbol: string };
}

function TransactionFeeDisplay({ baseAsset, gasLimitToUse, gasPriceToUse, fiatAsset }: Props) {
  const transactionFeeETH = gasStringsToMaxGasNumber(gasPriceToUse, gasLimitToUse);
  const baseAssetSymbol: string = baseAsset.ticker || 'ETH';

  const fiatValue: string = bigify(fiatAsset.rate).multipliedBy(transactionFeeETH).toFixed(4);

  return (
    <Fragment>
      {transactionFeeETH.toFixed(4)} {baseAssetSymbol} / {fiatAsset.symbol}
      {fiatValue} {fiatAsset.fiat}
    </Fragment>
  );
}

export default TransactionFeeDisplay;
