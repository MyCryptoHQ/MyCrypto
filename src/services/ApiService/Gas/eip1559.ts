import { hexlify } from '@ethersproject/bytes';
import BigNumber from 'bignumber.js';

import { ProviderHandler } from '@services/EthService';
import { bigify, fromWei, getDecimalFromEtherUnit, toWei } from '@utils';

// How many blocks to consider for priority fee estimation
const FEE_HISTORY_BLOCKS = 5;
// Which percentile of effective priority fees to include
const FEE_HISTORY_PERCENTILE = 1;
// Which base fee to trigger priority fee estimation at
const PRIORITY_FEE_ESTIMATION_TRIGGER = 100; // GWEI
// Returned if above trigger is not met
const DEFAULT_PRIORITY_FEE = bigify(toWei('3', getDecimalFromEtherUnit('gwei')));
// In case something goes wrong fall back to this estimate
export const FALLBACK_ESTIMATE = {
  maxFeePerGas: bigify(toWei('20', getDecimalFromEtherUnit('gwei'))),
  maxPriorityFeePerGas: DEFAULT_PRIORITY_FEE,
  baseFee: undefined
};

const roundToWholeGwei = (wei: BigNumber) => {
  const gwei = bigify(fromWei(wei, 'gwei'));
  const rounded = gwei.integerValue(BigNumber.ROUND_HALF_UP);
  return bigify(toWei(rounded.toString(10), getDecimalFromEtherUnit('gwei')));
};

const getBaseFeeMultiplier = (baseFeeGwei: BigNumber) => {
  if (baseFeeGwei.lte(40)) {
    return bigify(2.0);
  } else if (baseFeeGwei.lte(100)) {
    return bigify(1.6);
  } else if (baseFeeGwei.lte(200)) {
    return bigify(1.4);
  } else {
    return bigify(1.2);
  }
};

const estimatePriorityFee = async (
  provider: ProviderHandler,
  baseFeeGwei: BigNumber,
  blockNumber: number
) => {
  if (baseFeeGwei.lt(PRIORITY_FEE_ESTIMATION_TRIGGER)) {
    return DEFAULT_PRIORITY_FEE;
  }
  const feeHistory = await provider.getFeeHistory(FEE_HISTORY_BLOCKS, hexlify(blockNumber), [
    FEE_HISTORY_PERCENTILE
  ]);

  const rewards = feeHistory.reward?.map((r) => bigify(r[0]));
  if (!rewards) {
    return null;
  }

  // Take median
  rewards.sort();
  return rewards[Math.floor(rewards.length / 2)];
};

export const estimateFees = async (provider: ProviderHandler) => {
  try {
    const latestBlock = await provider.getLatestBlock();

    if (!latestBlock.baseFeePerGas) {
      throw new Error('An error occurred while fetching current base fee, falling back');
    }

    const baseFee = bigify(latestBlock.baseFeePerGas);

    const baseFeeGwei = bigify(fromWei(baseFee, 'gwei'));

    const maxPriorityFeePerGas = await estimatePriorityFee(
      provider,
      baseFeeGwei,
      latestBlock.number
    );

    if (!maxPriorityFeePerGas) {
      throw new Error('An error occurred while estimating priority fee, falling back');
    }

    const multiplier = getBaseFeeMultiplier(baseFeeGwei);

    const potentialMaxFee = baseFee.multipliedBy(multiplier);
    const maxFeePerGas = maxPriorityFeePerGas.gt(potentialMaxFee)
      ? potentialMaxFee.plus(maxPriorityFeePerGas)
      : potentialMaxFee;

    return {
      maxFeePerGas: roundToWholeGwei(maxFeePerGas),
      maxPriorityFeePerGas: roundToWholeGwei(maxPriorityFeePerGas),
      baseFee
    };
  } catch (err) {
    console.error(err);
    return FALLBACK_ESTIMATE;
  }
};
