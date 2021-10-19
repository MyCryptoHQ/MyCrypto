import { BigNumber } from 'bignumber.js';

import { bigify } from './bigify';
import { bigNumGasPriceToViewableGwei } from './makeTransaction';
import { gasStringsToMaxGasNumber } from './units';

export const calculateMinMaxFee = ({
  baseFee,
  maxFeePerGas,
  maxPriorityFeePerGas,
  gasLimit,
  baseAssetRate = 0
}: {
  baseFee?: BigNumber;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gasLimit: string;
  baseAssetRate?: string | number;
}) => {
  const viewableBaseFee = baseFee && bigify(bigNumGasPriceToViewableGwei(baseFee));

  const maxFee = gasStringsToMaxGasNumber(maxFeePerGas, gasLimit);
  const maxFeeFiat = maxFee.multipliedBy(baseAssetRate);
  const hasFiatValue = maxFeeFiat.gt(0);

  const minMaxFee =
    viewableBaseFee &&
    BigNumber.min(
      bigify(maxPriorityFeePerGas).gt(viewableBaseFee)
        ? bigify(maxPriorityFeePerGas).plus(viewableBaseFee)
        : viewableBaseFee,
      maxFeePerGas
    );

  const minFee = minMaxFee ? gasStringsToMaxGasNumber(minMaxFee.toString(), gasLimit) : maxFee;
  const minFeeFiat = minFee.multipliedBy(baseAssetRate);

  const avgFee = minFee.plus(maxFee).dividedBy(2);
  const avgFeeFiat = avgFee.multipliedBy(baseAssetRate);

  return {
    minFee,
    minFeeFiat,
    avgFee,
    avgFeeFiat,
    maxFee,
    maxFeeFiat,
    hasFiatValue,
    viewableBaseFee
  };
};
