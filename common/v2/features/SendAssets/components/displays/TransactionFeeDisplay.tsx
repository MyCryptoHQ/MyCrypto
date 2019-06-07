import { ITxFields } from '../../types';
import { gasPriceToBase, fromWei } from 'v2/libs/units';
import BN from 'bn.js';
import { getNetworkByName, getBaseAssetByNetwork } from 'v2/libs/networks/networks';
import { Network } from 'v2/services/Network/types';
import { Asset } from 'v2/services/Asset/types';
import React from 'react';

interface Props {
  values: ITxFields;
  fiatAsset: { fiat: string; value: string; symbol: string };
}

function TransactionFeeDisplay({ values, fiatAsset }: Props) {
  const gasLimitToUse =
    values.isAdvancedTransaction && values.isGasLimitManual
      ? values.gasLimitField
      : values.gasLimitEstimated;
  const gasPriceToUse = values.isAdvancedTransaction ? values.gasPriceField : values.gasPriceSlider;
  const transactionFeeWei: BN = gasPriceToBase(
    parseFloat(gasPriceToUse) * parseFloat(gasLimitToUse)
  );
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(4);
  let baseAsset = 'Ether';
  if (values.asset && values.asset.network) {
    const assetNetwork: Network | undefined = getNetworkByName(values.asset.network);
    if (assetNetwork) {
      const networkBaseAsset: Asset | undefined = getBaseAssetByNetwork(assetNetwork);
      if (networkBaseAsset) {
        baseAsset = networkBaseAsset.ticker;
      }
    }
  }

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
