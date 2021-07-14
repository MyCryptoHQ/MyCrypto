import { GAS_PRICE_DEFAULT } from '@config';
import { ProviderHandler } from '@services/EthService';
import { GasEstimates, ITxObject, Network } from '@types';
import { bigNumGasPriceToViewableGwei } from '@utils';

import { suggestFees } from './eip1559';
import { fetchGasEstimates } from './gas';

export function getDefaultEstimates(network?: Network) {
  // Must yield time for testability
  const time = Date.now();
  if (!network) {
    const gasSettings = GAS_PRICE_DEFAULT;
    return {
      safeLow: gasSettings.min,
      standard: gasSettings.initial,
      fast: gasSettings.initial,
      fastest: gasSettings.max,
      isDefault: true,
      chainId: 60,
      time
    };
  } else {
    const gasSettings = network.isCustom ? GAS_PRICE_DEFAULT : network.gasPriceSettings;

    return {
      safeLow: gasSettings.min,
      standard: gasSettings.initial,
      fast: gasSettings.initial,
      fastest: gasSettings.max,
      isDefault: true,
      chainId: network.chainId,
      time
    };
  }
}

export async function fetchGasPriceEstimates(network?: Network): Promise<GasEstimates> {
  // Don't try on non-estimating network
  if (!network || network.isCustom || !network.shouldEstimateGasPrice) {
    const defaultEstimates: GasEstimates = getDefaultEstimates(network);
    return defaultEstimates;
  }

  // Try to fetch new estimates
  return fetchGasEstimates().catch((err) => {
    console.error(err);
    return getDefaultEstimates(network);
  });
}

export async function fetchEIP1559PriceEstimates(network: Network) {
  const provider = new ProviderHandler(network);
  const result = await suggestFees(provider);
  // @todo Decide which strategy to use?
  //const { gasPrice, ...rest } = await provider.getFeeData();
  //return rest;
  return result.map(({ maxFeePerGas, maxPriorityFeePerGas }) => ({
    maxFeePerGas: Math.floor(maxFeePerGas),
    maxPriorityFeePerGas: Math.floor(maxPriorityFeePerGas)
  }))[0];
}

// Returns fast gasPrice or EIP1559 gas params in gwei
export async function fetchUniversalGasPriceEstimate(network?: Network) {
  if (network && network.supportsEIP1559) {
    const { maxFeePerGas, maxPriorityFeePerGas } = await fetchEIP1559PriceEstimates(network);
    return {
      maxFeePerGas: maxFeePerGas ? bigNumGasPriceToViewableGwei(maxFeePerGas) : undefined,
      maxPriorityFeePerGas: maxPriorityFeePerGas
        ? bigNumGasPriceToViewableGwei(maxPriorityFeePerGas)
        : undefined
    };
  }

  const { fast } = await fetchGasPriceEstimates(network);

  return { gasPrice: fast.toString() };
}

export const getGasEstimate = async (network: Network, tx: Partial<ITxObject>) => {
  const provider = new ProviderHandler(network);
  return await provider.estimateGas(tx);
};
