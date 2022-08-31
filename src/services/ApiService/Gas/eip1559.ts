import BigNumber from 'bignumber.js';

import { ProviderHandler } from '@services/EthService';
import { bigify, fromWei, getDecimalFromEtherUnit, hexlify, toWei } from '@utils';

import { MAX_GAS_FAST } from './constants';

// How many blocks to consider for priority fee estimation
const FEE_HISTORY_BLOCKS = 10;
// Which percentile of effective priority fees to include
const FEE_HISTORY_PERCENTILE = 5;
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
const PRIORITY_FEE_INCREASE_BOUNDARY = 200; // %

const toGwei = (wei: BigNumber) => bigify(fromWei(wei.integerValue(), 'gwei'));

const roundToWholeGwei = (wei: BigNumber) => {
  const gwei = toGwei(wei);
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
  const feeHistory = await provider.getFeeHistory(
    hexlify(FEE_HISTORY_BLOCKS),
    hexlify(blockNumber),
    [FEE_HISTORY_PERCENTILE]
  );

  const rewards = feeHistory.reward
    ?.map((r) => bigify(r[0]))
    .filter((r) => !r.isZero())
    .sort();

  if (!rewards) {
    return null;
  }

  // Calculate percentage increases from between ordered list of fees
  const percentageIncreases = rewards.reduce((acc, cur, i, arr) => {
    if (i === arr.length - 1) {
      return acc;
    }
    const next = arr[i + 1];
    const p = next.minus(cur).dividedBy(cur).multipliedBy(100);
    return [...acc, p];
  }, []);
  const highestIncrease = BigNumber.max(...percentageIncreases);
  const highestIncreaseIndex = percentageIncreases.findIndex((p) => p.eq(highestIncrease));

  // If we have big increase in value, we could be considering "outliers" in our estimate
  // Skip the low elements and take a new median
  const values =
    highestIncrease.gte(PRIORITY_FEE_INCREASE_BOUNDARY) &&
    highestIncreaseIndex >= Math.floor(rewards.length / 2)
      ? rewards.slice(highestIncreaseIndex)
      : rewards;

  return values[Math.floor(values.length / 2)];
};

export const estimateFees = async (provider: ProviderHandler) => {
  try {
    const latestBlock = await provider.getLatestBlock();

    if (!latestBlock.baseFeePerGas) {
      throw new Error('An error occurred while fetching current base fee, falling back');
    }

    const baseFee = bigify(latestBlock.baseFeePerGas);

    const baseFeeGwei = bigify(fromWei(baseFee, 'gwei'));

    const estimatedPriorityFee = await estimatePriorityFee(
      provider,
      baseFeeGwei,
      latestBlock.number
    );

    if (estimatedPriorityFee === null) {
      throw new Error('An error occurred while estimating priority fee, falling back');
    }

    const maxPriorityFeePerGas = BigNumber.max(estimatedPriorityFee, DEFAULT_PRIORITY_FEE);

    const multiplier = getBaseFeeMultiplier(baseFeeGwei);

    const potentialMaxFee = baseFee.multipliedBy(multiplier);
    const maxFeePerGas = maxPriorityFeePerGas.gt(potentialMaxFee)
      ? potentialMaxFee.plus(maxPriorityFeePerGas)
      : potentialMaxFee;

    if (toGwei(maxFeePerGas).gte(MAX_GAS_FAST) || toGwei(maxPriorityFeePerGas).gte(MAX_GAS_FAST)) {
      throw new Error('Estimated gas fee was much higher than expected, erroring');
    }

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
